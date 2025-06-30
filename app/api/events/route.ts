import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/events - Fetch events with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const instructor = searchParams.get('instructor');

    let query = supabase
      .from('events')
      .select(`
        *,
        instructor:profiles(full_name, avatar_url),
        attendees:event_attendees(count)
      `);

    if (type) {
      query = query.eq('type', type);
    }
    if (status) {
      query = query.eq('status', status);
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

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      type, 
      date, 
      time, 
      location, 
      description, 
      maxAttendees 
    } = body;

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        type,
        date,
        time,
        location,
        description,
        max_attendees: maxAttendees,
        instructor_id: user.id,
        attendees: 0,
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