'use client'

import { db } from "@/firebase/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

// define free and pro plans


// Number of PDFs allowed
const PRO_PLAN = 30;
const FREE_PLAN = 3;



function useSubsscription() {
    const [hasActiveMembership, setHasActiveMembership] = useState(null)
    const [isOverFileLimit, setIsOverFileLimit] = useState(false)
    const { user } = useUser();

    // listen to user document
    const [snapshot, loading, error] = useDocument(
        user && doc(db,'users',user.id),
        {
            snapshotListenOptions: { includeMetadataChanges: true }
        }
    );

    // listen to files collection of user
    const [ fileSnapshot, fileLoading] = useCollection(
        user && collection(db,'users',user.id,'files'),
        {
            snapshotListenOptions: { includeMetadataChanges: true }
        }
    );

    useEffect(() => {
        if(!snapshot) return;

        //getting users data
        const data = snapshot.data(); 
        if(!data) return;

        setHasActiveMembership(data.activeMembership)



    }, [snapshot])

    useEffect(() => {
        if(!fileSnapshot || !hasActiveMembership===null) return;

        const files = fileSnapshot.docs;
        const usersLimit  = hasActiveMembership ? PRO_PLAN : FREE_PLAN;

        // debugging
        // console.log("Checking if user is over file limit...",files.length,usersLimit)
        
        setIsOverFileLimit(files.length >= usersLimit)
        
    }, [fileSnapshot, hasActiveMembership, PRO_PLAN, FREE_PLAN])
    return {hasActiveMembership,isOverFileLimit,loading,error,fileLoading}
   
}

export default useSubsscription