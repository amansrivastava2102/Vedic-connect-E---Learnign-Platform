-- Simple VedicConnect Database Schema
-- Run this in your Supabase SQL editor

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'instructor');
CREATE TYPE difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
CREATE TYPE event_type AS ENUM ('lecture', 'workshop', 'exam', 'seminar');
CREATE TYPE event_status AS ENUM ('upcoming', 'completed', 'cancelled');
CREATE TYPE session_status AS ENUM ('live', 'upcoming', 'completed');
CREATE TYPE document_type AS ENUM ('pdf', 'docx', 'pptx');

-- Profiles table
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
  duration INTEGER,
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
  progress INTEGER DEFAULT 0,
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

-- Lecture Views table
CREATE TABLE lecture_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_lectures_course ON lectures(course_id);
CREATE INDEX idx_lectures_instructor ON lectures(instructor_id);
CREATE INDEX idx_events_instructor ON events(instructor_id);
CREATE INDEX idx_documents_course ON documents(course_id);
CREATE INDEX idx_live_sessions_course ON live_sessions(course_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

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

-- Basic policies (you can add more specific ones later)
CREATE POLICY "Enable read access for all users" ON courses FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON courses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for users based on instructor_id" ON courses FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Enable delete for users based on instructor_id" ON courses FOR DELETE USING (auth.uid() = instructor_id);

CREATE POLICY "Enable read access for all users" ON lectures FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON lectures FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for users based on instructor_id" ON lectures FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Enable delete for users based on instructor_id" ON lectures FOR DELETE USING (auth.uid() = instructor_id);

CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for users based on instructor_id" ON events FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Enable delete for users based on instructor_id" ON events FOR DELETE USING (auth.uid() = instructor_id);

CREATE POLICY "Enable read access for all users" ON documents FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for users based on instructor_id" ON documents FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Enable delete for users based on instructor_id" ON documents FOR DELETE USING (auth.uid() = instructor_id);

CREATE POLICY "Enable read access for all users" ON live_sessions FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON live_sessions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for users based on instructor_id" ON live_sessions FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Enable delete for users based on instructor_id" ON live_sessions FOR DELETE USING (auth.uid() = instructor_id);

CREATE POLICY "Enable read access for all users" ON enrollments FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON enrollments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for users based on student_id" ON enrollments FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable update for users based on id" ON profiles FOR UPDATE USING (auth.uid() = id);

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