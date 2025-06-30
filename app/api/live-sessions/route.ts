import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/live-sessions - Fetch live sessions with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const courseId = searchParams.get('courseId');
    const instructor = searchParams.get('instructor');

    let query = supabase
      .from('live_sessions')
      .select(`
        *,
        course:courses(title),
        instructor:profiles(full_name, avatar_url),
        participants:session_participants(count)
      `);

    if (status) {
      query = query.eq('status', status);
    }
    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    if (instructor) {
      query = query.eq('instructor_id', instructor);
    }

    const { data, error } = await query.order('date', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/live-sessions - Create a new live session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      courseId, 
      date, 
      time, 
      duration, 
      maxParticipants, 
      meetLink, 
      description 
    } = body;

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is instructor of the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single();

    if (courseError || course.instructor_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('live_sessions')
      .insert({
        title,
        course_id: courseId,
        instructor_id: user.id,
        date,
        time,
        duration,
        max_participants: maxParticipants,
        meet_link: meetLink,
        description,
        participants: 0,
        status: 'upcoming'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 