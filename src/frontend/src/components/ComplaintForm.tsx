import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubmitComplaint } from '../hooks/useQueries';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import { Upload, Loader2, MapPin, Navigation } from 'lucide-react';

interface ComplaintFormProps {
  onSuccess?: () => void;
}

export default function ComplaintForm({ onSuccess }: ComplaintFormProps) {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);

  const submitComplaint = useSubmitComplaint();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsCapturingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsCapturingLocation(false);
        toast.success('Location captured successfully!');
      },
      (error) => {
        setIsCapturingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error('Location permission denied. Please enable location access.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error('Location information unavailable.');
        } else {
          toast.error('Failed to capture location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !location || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let photoBlob: ExternalBlob | undefined;

      if (photoFile) {
        const arrayBuffer = await photoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        photoBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      const complaintId = await submitComplaint.mutateAsync({
        description,
        category,
        location,
        photo: photoBlob,
        latitude,
        longitude,
      });

      toast.success(`Complaint submitted! Tracking ID: ${complaintId}`);
      
      // Reset form
      setCategory('');
      setLocation('');
      setDescription('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setUploadProgress(0);
      setLatitude(undefined);
      setLongitude(undefined);

      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit New Complaint</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pothole">Pothole</SelectItem>
                <SelectItem value="garbage">Garbage Collection</SelectItem>
                <SelectItem value="streetlight">Streetlight Not Working</SelectItem>
                <SelectItem value="water">Water Supply Issue</SelectItem>
                <SelectItem value="drainage">Drainage Problem</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location (e.g., MG Road, Near City Hall)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>GPS Location (Optional)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={captureLocation}
                disabled={isCapturingLocation}
                className="gap-2"
              >
                {isCapturingLocation ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4" />
                    Capture Current Location
                  </>
                )}
              </Button>
              {latitude && longitude && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Upload Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="flex-1"
              />
              {photoPreview && (
                <img src={photoPreview} alt="Preview" className="h-16 w-16 object-cover rounded" />
              )}
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="text-sm text-muted-foreground">
                Upload progress: {uploadProgress}%
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={submitComplaint.isPending}>
            {submitComplaint.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit Complaint
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
