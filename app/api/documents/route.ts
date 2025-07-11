import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/firebase/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';


export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const q = query(
      collection(db, 'users', userId, 'files'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamp to ISO string for serialization
      createdAt: doc.data().createdAt?.toDate().toISOString()
    }));

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
