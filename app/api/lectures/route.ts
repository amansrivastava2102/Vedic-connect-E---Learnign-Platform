import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/lectures - Fetch lectures with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const instructor = searchParams.get('instructor');

    let query = supabase
      .from('lectures')
      .select(`
        *,
        course:courses(title),
        instructor:profiles(full_name, avatar_url),
        views:lecture_views(count)
      `);

    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    if (instructor) {
      query = query.eq('instructor_id', instructor);
    }

    const { data, error } = await query.order('upload_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/lectures - Create a new lecture
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      courseId, 
      duration, 
      videoUrl, 
      thumbnail, 
      category, 
      difficulty 
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
      .from('lectures')
      .insert({
        title,
        description,
        course_id: courseId,
        instructor_id: user.id,
        duration,
        video_url: videoUrl,
        thumbnail,
        category,
        difficulty,
        views: 0,
        upload_date: new Date().toISOString()
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