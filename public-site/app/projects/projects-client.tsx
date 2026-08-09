// app/projects/projects-client.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/page-header";
import { Search } from "lucide-react";
import { Category, Project } from "@/lib/features/projects/project-api";
import HeroBanner from "@/components/hero/HeroBanner";

interface ProjectsClientProps {
  projects: Project[];
  categories: Category[];
}

export default function ProjectsClient({
  projects,
  categories,
}: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Memoized filtered projects for better performance
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchLower = searchQuery.toLowerCase();

      // Search matching
      const matchesSearch =
        searchQuery === "" ||
        project.name.toLowerCase().includes(searchLower) ||
        (project.description?.toLowerCase().includes(searchLower) ?? false) ||
        (project.industry?.toLowerCase().includes(searchLower) ?? false) ||
        project.client.toLowerCase().includes(searchLower) ||
        project.category.name.toLowerCase().includes(searchLower);

      // Category matching
      const matchesCategory =
        selectedCategory === "all" ||
        project.categoryId === Number(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  // Get selected category details
  const selectedCategoryDetails = useMemo(() => {
    if (selectedCategory === "all") return null;
    return categories.find((cat) => cat.id === Number(selectedCategory));
  }, [selectedCategory, categories]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner
        type="projects"
        heightClass="h-[350px] md:h-[450px]"
        ctaText="View Projects"
        defaultLink="/projects"
        autoPlayInterval={6000}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects by name, client, industry, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[240px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Description Badge */}
          {selectedCategoryDetails && selectedCategoryDetails.description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-muted rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <Badge className="bg-[#422f7e] text-white hover:bg-[#422f7e]/90">
                  {selectedCategoryDetails.name}
                </Badge>
                <p className="text-sm text-muted-foreground flex-1">
                  {selectedCategoryDetails.description}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results count and filters indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6 flex-wrap gap-4"
        >
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length}{" "}
            {filteredProjects.length === 1 ? "project" : "projects"}
            {selectedCategory !== "all" && (
              <span className="font-medium text-foreground">
                {" "}
                in {selectedCategoryDetails?.name}
              </span>
            )}
          </p>

          {(searchQuery || selectedCategory !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear All Filters
            </Button>
          )}
        </motion.div>

        {/* Projects grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-56 w-full overflow-hidden rounded-t-lg px-4 py-2">
                    <Image
                      src={
                        project.imageUrl[0] ||
                        "/placeholder.svg?height=400&width=600"
                      }
                      alt={project.name}
                      fill
                      className="object-cover px-4 py-3 transition-transform duration-500 ease-in-out group-hover:scale-110 rounded-3xl"
                    />
                    <Badge className="absolute top-3 right-3 bg-[#422f7e] text-white hover:bg-[#422f7e]/90">
                      {project.category.name}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <CardDescription
                      className="line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: project.description || "",
                      }}
                    />
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.industry && (
                        <Badge variant="outline" className="text-xs">
                          {project.industry}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {project.client}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      className="w-full bg-[#422f7e] hover:bg-[#422f7e]/90 text-white"
                    >
                      <Link
                        href={`/projects/${
                          project.slug || encodeURIComponent(project.name)
                        }`}
                      >
                        View Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* No results */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-xl font-semibold">No projects found</h3>
              <p className="text-muted-foreground">
                No projects match your current filters. Try adjusting your
                search or category selection.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
                <Button
                  asChild
                  className="bg-[#422f7e] hover:bg-[#422f7e]/90 text-white"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
