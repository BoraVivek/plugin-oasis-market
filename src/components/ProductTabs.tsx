
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductVersion, Review } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ProductTabsProps {
  description: string;
  versions: ProductVersion[];
  reviews: Review[];
  discussionUrl?: string;
}

const ProductTabs = ({
  description,
  versions,
  reviews,
  discussionUrl
}: ProductTabsProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="description">
        <AccordionTrigger className="text-lg">Description</AccordionTrigger>
        <AccordionContent>
          {description ? (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <p className="text-muted-foreground">No description provided.</p>
          )}
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="versions">
        <AccordionTrigger className="text-lg">Version History</AccordionTrigger>
        <AccordionContent>
          {versions && versions.length > 0 ? (
            <div className="space-y-6">
              {versions.map((version, index) => (
                <div key={version.id} className="border-b border-border pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-semibold">Version {version.version}</h3>
                    <span className="text-sm text-muted-foreground">
                      {version.date ? formatDate(version.date) : 'Unknown date'}
                    </span>
                  </div>
                  {version.changes && version.changes.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {version.changes.map((change, idx) => (
                        <li key={idx} className="text-sm">{change}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No changes listed for this version.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No version history available.</p>
          )}
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="reviews">
        <AccordionTrigger className="text-lg">Ratings & Reviews</AccordionTrigger>
        <AccordionContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={review.avatar} alt={review.author} />
                        <AvatarFallback>
                          {review.author ? review.author.substring(0, 2).toUpperCase() : 'UN'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.author || 'Anonymous'}</div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating 
                                  ? "text-amber-400 fill-amber-400" 
                                  : "text-gray-300 fill-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  {review.content ? (
                    <p className="mt-2 text-sm">{review.content}</p>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">No written review.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4">No reviews yet. Be the first to review this product!</p>
          )}
        </AccordionContent>
      </AccordionItem>
      
      {discussionUrl && (
        <AccordionItem value="discussion">
          <AccordionTrigger className="text-lg">Discussion</AccordionTrigger>
          <AccordionContent>
            <div className="text-center py-4">
              <p className="mb-4">Join the discussion about this product on our forums</p>
              <a
                href={discussionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Visit Discussion Forum
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};

export default ProductTabs;
