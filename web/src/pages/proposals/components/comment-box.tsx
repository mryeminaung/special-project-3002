import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquareIcon, SendIcon } from 'lucide-react';

type Comment = {
  id: number;
  author: {
    name: string;
    role: 'Student' | 'Supervisor' | 'IC';
  };
  content: string;
  created_at: string;
};

export default function CommentBox() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const handleSubmit = () => {
    if (!comment.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: { name: 'Dr. Myat Thuzar Tun', role: 'IC' },
        content: comment,
        created_at: new Date().toLocaleDateString(),
      },
    ]);

    setComment('');
  };

  const roleColor = (role: Comment['author']['role']) => {
    switch (role) {
      case 'Supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'IC':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className='border-gray-200 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <MessageSquareIcon className='h-5 w-5 text-primary-600' />
          Comments & Feedback
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          {comments.map((c) => (
            <div
              key={c.id}
              className='rounded-lg border border-gray-200 p-4 bg-gray-50'
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <p className='font-medium text-gray-900'>{c.author.name}</p>
                  <Badge className={roleColor(c.author.role)}>
                    {c.author.role}
                  </Badge>
                </div>
                <span className='text-xs text-gray-500'>{c.created_at}</span>
              </div>

              <p className='text-sm text-gray-700 whitespace-pre-line'>
                {c.content}
              </p>
            </div>
          ))}
        </div>

        <div className='space-y-3'>
          <Textarea
            placeholder='Write your comment or feedback...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='min-h-[100px]'
          />

          <div className='flex justify-end'>
            <Button
              onClick={handleSubmit}
              className='flex items-center gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500'
            >
              <SendIcon className='h-4 w-4' />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
