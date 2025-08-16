import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Simple query to keep the database active
    const { data, error } = await supabase
      .from('users')
      .select('user_id')
      .limit(1);
    
    if (error) {
      console.error('Ping failed:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    console.log('Database ping successful at:', new Date().toISOString());
    return NextResponse.json({
      success: true,
      message: 'Database is active',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ping error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}