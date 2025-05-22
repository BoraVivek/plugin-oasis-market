
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ProductVersion, Review } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';

interface ProductTabsProps {
  description: string;
  versions: ProductVersion[];
  reviews: Review[];
  discussionUrl?: string;
  productId: string;
}

const ProductTabs = ({ 
  description, 
  versions, 
  reviews, 
  discussionUrl = "#",
  productId 
}: ProductTabsProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to submit a review");
      
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: reviewRating,
          content: reviewText,
          date: new Date().toISOString()
        });
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Review submitted for moderation");
      setReviewText("");
      setReviewRating(5);
      queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
    },
    onError: (error: any) => {
      toast.error(`Error submitting review: ${error.message}`);
    }
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    reviewMutation.mutate();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          className={`h-4 w-4 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const handleRatingClick = (rating: number) => {
    setReviewRating(rating);
  };

  const renderRatingInput = () => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleRatingClick(rating)}
            onMouseEnter={() => setHoverRating(rating)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-5 w-5 ${
                (hoverRating ? rating <= hoverRating : rating <= reviewRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="versions">Versions</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="discussion">Discussion</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description">
        <Card>
          <CardHeader>
            <CardTitle>Product Description</CardTitle>
          </CardHeader>
          <CardContent>
            {description ? (
              <div className="prose max-w-none">
                {/* This would ideally be processed through a markdown renderer */}
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            ) : (
              <p className="text-muted-foreground">No description available for this product.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="versions">
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
            <CardDescription>
              Release notes and changes for each version
            </CardDescription>
          </CardHeader>
          <CardContent>
            {versions && versions.length > 0 ? (
              <div className="space-y-6">
                {versions
                  .sort((a, b) => 
                    new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
                  )
                  .map((version) => (
                    <div key={version.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-semibold flex items-center">
                          <Badge variant="outline" className="mr-2">v{version.version}</Badge>
                          {version === versions[0] && (
                            <Badge variant="secondary" className="ml-2">Latest</Badge>
                          )}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(version.date || "")}
                        </span>
                      </div>
                      
                      {version.changes && version.changes.length > 0 ? (
                        <ul className="space-y-1 text-sm">
                          {version.changes.map((change, index) => (
                            <li key={index}>{change}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No change notes provided.</p>
                      )}
                    </div>
                  ))
                }
              </div>
            ) : (
              <p className="text-muted-foreground">No version history available.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="reviews">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              Feedback from users who have purchased this product
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Review submission form */}
            {user && (
              <div className="mb-8 border-b pb-6">
                <h3 className="font-medium mb-3">Write a Review</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Your Rating</Label>
                      {renderRatingInput()}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="review">Your Review</Label>
                      <Textarea
                        id="review"
                        placeholder="Share your experience with this product..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Your review will be submitted for moderation before it appears publicly.
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={reviewMutation.isPending}
                      data-event="submit-product-review"
                    >
                      {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Reviews list */}
            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} alt={review.author} />
                        <AvatarFallback>
                          {review.author?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{review.author || "Anonymous"}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(review.date)}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        
                        {review.content && (
                          <p className="text-sm mt-1">{review.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No reviews yet. Be the first to share your experience!
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="discussion">
        <Card>
          <CardHeader>
            <CardTitle>Community Discussion</CardTitle>
            <CardDescription>
              Join the conversation about this product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Visit our community forums to join discussions about this product.
              </p>
              <Button 
                onClick={() => window.open(discussionUrl, "_blank")}
                data-event="product-forum-click"
              >
                Go to Forums
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
