import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Perform multiple database operations to ensure activity
    const operations = [
      // Check users table
      supabase.from('users').select('user_id').limit(1),
      
      // Check if we can query other tables
      supabase.from('student_profiles').select('student_id').limit(1),
      
      // Simple RPC call if available
      supabase.rpc('ping_database').catch(() => null), // Don't fail if RPC doesn't exist
    ];
    
    const results = await Promise.allSettled(operations);
    
    // Count successful operations
    const successfulOps = results.filter(result => 
      result.status === 'fulfilled' && !result.value?.error
    ).length;
    
    console.log(`Database ping completed: ${successfulOps}/${operations.length} operations successful at:`, new Date().toISOString());
    
    if (successfulOps === 0) {
      throw new Error('All database operations failed');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database is active',
      operationsCompleted: successfulOps,
      totalOperations: operations.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ping error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}