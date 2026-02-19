import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAddComplaintRating } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import type { Complaint } from '../backend';

interface ComplaintRatingProps {
  complaint: Complaint;
}

export default function ComplaintRating({ complaint }: ComplaintRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const addRating = useAddComplaintRating();

  const hasRating = complaint.rating !== undefined && complaint.rating !== null;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await addRating.mutateAsync({
        complaintId: complaint.id,
        rating,
        feedback,
      });
      toast.success('Thank you for your feedback!');
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  if (hasRating) {
    return (
      <div className="border-t pt-4 space-y-2">
        <Label>Your Rating</Label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= Number(complaint.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-2">
            {complaint.rating} / 5
          </span>
        </div>
        {complaint.feedback && (
          <div className="mt-2">
            <Label>Your Feedback</Label>
            <p className="text-sm text-muted-foreground mt-1">{complaint.feedback}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-t pt-4 space-y-4">
      <div>
        <Label>Rate the Resolution</Label>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-200'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback">Feedback (Optional)</Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your experience..."
          rows={3}
        />
      </div>

      <Button onClick={handleSubmit} disabled={addRating.isPending || rating === 0}>
        {addRating.isPending ? 'Submitting...' : 'Submit Rating'}
      </Button>
    </div>
  );
}
