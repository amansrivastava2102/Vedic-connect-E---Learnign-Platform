import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/documents - Fetch documents with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    let query = supabase
      .from('documents')
      .select(`
        *,
        course:courses(title),
        instructor:profiles(full_name, avatar_url)
      `);

    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (category) {
      query = query.eq('category', category);
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

// POST /api/documents - Upload a new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      courseId, 
      type, 
      size, 
      description, 
      category, 
      difficulty,
      fileUrl 
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
      .from('documents')
      .insert({
        title,
        course_id: courseId,
        instructor_id: user.id,
        type,
        size,
        description,
        category,
        difficulty,
        file_url: fileUrl,
        downloads: 0,
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