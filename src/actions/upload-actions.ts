'use server';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '@/lib/s3';
import { randomUUID } from 'crypto';

export async function getPresignedUrl(fileName: string, contentType: string) {
    if (!process.env.R2_BUCKET_NAME) {
        throw new Error('R2_BUCKET_NAME is not defined');
    }

    // Ensure only images are allowed
    if (!contentType.startsWith('image/')) {
        throw new Error('Only image uploads are allowed');
    }

    const fileExtension = fileName.split('.').pop();
    const key = `${randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    });

    try {
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // URL expires in 10 minutes

        // Construct the public URL
        // If R2_PUBLIC_URL is provided, use it (e.g. https://cdn.example.com)
        // Otherwise construct using the standard R2 dev URL pattern (though custom domain is recommended)
        const publicUrl = process.env.R2_PUBLIC_URL
            ? `${process.env.R2_PUBLIC_URL}/${key}`
            : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`; // This fallback might not be publicly accessible depending on bucket execution, usually public buckets need a custom domain or worker.

        return { success: true, url: signedUrl, key, publicUrl };
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return { success: false, error: 'Failed to generate upload URL' };
    }
}
