import { Project } from "@/data/dummyData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Heart,
  ShoppingCart,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  type: 'selling' | 'bought' | 'wishlist' | 'cart';
  onEdit?: () => void;
  onDelete?: () => void;
  onRemove?: () => void;
  onAddToCart?: () => void;
}

export function ProjectCard({ 
  project, 
  type, 
  onEdit, 
  onDelete, 
  onRemove,
  onAddToCart 
}: ProjectCardProps) {
  const statusColors = {
    active: "bg-success/10 text-success border-success/20",
    draft: "bg-warning/10 text-warning border-warning/20",
    paused: "bg-muted text-muted-foreground border-border",
  };

  const categories = [
    "Web Development",
    "Mobile Development",
    "AI/ML",
    "Desktop Apps",
    "APIs",
    "Games",
    "Data Science",
    "DevOps",
  ];

  const mapCategoryToEnum = (category: string): string => {
    const categoryMap: Record<string, string> = {
      WebDevelopment: "Web Development",
      MobileDevelopment: "Mobile Development",
      ArtificialIntelligence: "Artificial Intelligence",
      "Desktop Apps": "Deskto Apps",
      APIs: "APIs",
      Games: "Game Development",
      DataScience: "Data Science",
      DevOps: "DevOps",
    };
    return categoryMap[category] || category;
  };

  const category = mapCategoryToEnum(project.category);

  return (
    <div className="group bg-card rounded-xl shadow-xl overflow-hidden transition-all duration-200 hover:shadow-2xl animate-slide-up">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={project.imageUrls[0]}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {type === 'selling' && project.status && (
          <Badge 
            variant="outline" 
            className={cn("absolute top-3 left-3 capitalize", statusColors[project.status])}
          >
            {project.status}
          </Badge>
        )}
        <Badge className="absolute top-3 right-3 bg-background/90 text-foreground backdrop-blur-sm">
          {category}
        </Badge>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {project.description}
            </p>
          </div>
          
          {(type === 'selling' || type === 'wishlist' || type === 'cart') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {type === 'selling' && (
                  <>
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
                {type === 'wishlist' && (
                  <>
                    <DropdownMenuItem onClick={onAddToCart}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onRemove} className="text-destructive">
                      <Heart className="h-4 w-4 mr-2" />
                      Remove from Wishlist
                    </DropdownMenuItem>
                  </>
                )}
                {type === 'cart' && (
                  <DropdownMenuItem onClick={onRemove} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove from Cart
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-xs">
            {project.primaryLanguage}
          </Badge>
          {project.secondaryLanguages.slice(0, 2).map((lang) => (
            <Badge key={lang} variant="outline" className="text-xs">
              {lang}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-lg font-bold text-[#114B9C]">${project.price}</span>
          
          {type === 'selling' && project.sales !== undefined && (
            <span className="text-sm text-muted-foreground">
              {project.sales} sales · ${project.revenue?.toLocaleString()}
            </span>
          )}
          
          {type === 'bought' && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                if (!project.projectUrl) return;

                const link = document.createElement("a");
                link.href = project.projectUrl;
                link.download = project.name || "download";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>

          )}
          
          {type === 'wishlist' && (
            <Button size="sm" className="gap-1.5" onClick={onAddToCart}>
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </Button>
          )}
          
          {type === 'cart' && (
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
