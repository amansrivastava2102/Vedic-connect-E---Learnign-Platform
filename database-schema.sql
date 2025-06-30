-- VedicConnect Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'instructor');
CREATE TYPE difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
CREATE TYPE event_type AS ENUM ('lecture', 'workshop', 'exam', 'seminar');
CREATE TYPE event_status AS ENUM ('upcoming', 'completed', 'cancelled');
CREATE TYPE session_status AS ENUM ('live', 'upcoming', 'completed');
CREATE TYPE document_type AS ENUM ('pdf', 'docx', 'pptx');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role user_role DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT,
  difficulty difficulty_level,
  thumbnail TEXT,
  students INTEGER DEFAULT 0,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lectures table
CREATE TABLE lectures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  duration TEXT,
  video_url TEXT,
  thumbnail TEXT,
  category TEXT,
  difficulty difficulty_level,
  views INTEGER DEFAULT 0,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type event_type,
  date DATE,
  time TEXT,
  location TEXT,
  description TEXT,
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  attendees INTEGER DEFAULT 0,
  max_attendees INTEGER,
  status event_status DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type document_type,
  size TEXT,
  file_url TEXT,
  description TEXT,
  category TEXT,
  difficulty difficulty_level,
  downloads INTEGER DEFAULT 0,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live Sessions table
CREATE TABLE live_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE,
  time TEXT,
  duration INTEGER, -- in minutes
  meet_link TEXT,
  description TEXT,
  participants INTEGER DEFAULT 0,
  max_participants INTEGER,
  status session_status DEFAULT 'upcoming',
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0, -- percentage completed
  UNIQUE(student_id, course_id)
);

-- Event Attendees table
CREATE TABLE event_attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Session Participants table
CREATE TABLE session_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Lecture Views table (for tracking individual views)
CREATE TABLE lecture_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_lectures_course ON lectures(course_id);
CREATE INDEX idx_lectures_instructor ON lectures(instructor_id);
CREATE INDEX idx_events_instructor ON events(instructor_id);
CREATE INDEX idx_documents_course ON documents(course_id);
CREATE INDEX idx_live_sessions_course ON live_sessions(course_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment course students count
CREATE OR REPLACE FUNCTION increment_course_students(course_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE courses 
  SET students = students + 1 
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_views ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Instructors can create courses" ON courses FOR INSERT WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can update their courses" ON courses FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Instructors can delete their courses" ON courses FOR DELETE USING (auth.uid() = instructor_id);

-- Lectures policies
CREATE POLICY "Anyone can view lectures" ON lectures FOR SELECT USING (true);
CREATE POLICY "Instructors can create lectures" ON lectures FOR INSERT WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can update their lectures" ON lectures FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Instructors can delete their lectures" ON lectures FOR DELETE USING (auth.uid() = instructor_id);

-- Events policies
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Instructors can create events" ON events FOR INSERT WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can update their events" ON events FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Instructors can delete their events" ON events FOR DELETE USING (auth.uid() = instructor_id);

-- Documents policies
CREATE POLICY "Anyone can view documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Instructors can create documents" ON documents FOR INSERT WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can update their documents" ON documents FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Instructors can delete their documents" ON documents FOR DELETE USING (auth.uid() = instructor_id);

-- Live Sessions policies
CREATE POLICY "Anyone can view live sessions" ON live_sessions FOR SELECT USING (true);
CREATE POLICY "Instructors can create live sessions" ON live_sessions FOR INSERT WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can update their live sessions" ON live_sessions FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Instructors can delete their live sessions" ON live_sessions FOR DELETE USING (auth.uid() = instructor_id);

-- Enrollments policies
CREATE POLICY "Users can view their enrollments" ON enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users can enroll in courses" ON enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Users can update their enrollments" ON enrollments FOR UPDATE USING (auth.uid() = student_id);

-- Event Attendees policies
CREATE POLICY "Users can view event attendees" ON event_attendees FOR SELECT USING (true);
CREATE POLICY "Users can register for events" ON event_attendees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unregister from events" ON event_attendees FOR DELETE USING (auth.uid() = user_id);

-- Session Participants policies
CREATE POLICY "Users can view session participants" ON session_participants FOR SELECT USING (true);
CREATE POLICY "Users can join sessions" ON session_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave sessions" ON session_participants FOR DELETE USING (auth.uid() = user_id);

-- Lecture Views policies
CREATE POLICY "Users can view lecture views" ON lecture_views FOR SELECT USING (true);
CREATE POLICY "Users can create lecture views" ON lecture_views FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user(); 