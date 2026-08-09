"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Target,
  Eye,
  Award,
  Users,
  Globe,
  TrendingUp,
  MapPin,
  MessageCircleHeart,
  FileBadge,
  BookCheck,
} from "lucide-react";
import { SchemaOrg } from "@/components/schema-org";
import { breadcrumbSchema } from "@/lib/schema-data";
import Image from "next/image";
import useSWR from "swr";
import { Url } from "@/lib/url";
import { Suspense, useState } from "react";
import HeroBanner from "@/components/hero/HeroBanner";

export interface DataItem {
  id: number;
  name: string;
  createAt: string;
  order: number | null;
  imageUrl: string;
  skill: string;
  description: string;
}

export interface DataResponse {
  result: DataItem[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "Sagaljet is the reliable printing company that guarantees quality products and services to its clients in the Horn of Africa through excellence and innovation.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "Sagaljet aspires to be the leading agent of innovation in printing services that guarantees success for its clients in the Horn of Africa.",
  },
  {
    icon: MessageCircleHeart,
    title: "Honesty",
    description:
      "We conduct our business with transparency, integrity, and fairness in every client and partner relationship.",
  },
  {
    icon:FileBadge,
    title: "Quality Orientation",
    description:
      "We maintain high standards in materials, processes, and outcomes to ensure every product meets or exceeds client expectations.",
  },
  {
    icon: BookCheck,
    title: "Commitment",
    description:
      "We are dedicated to fulfilling our promises, meeting deadlines, and continuously improving our services.",
  },
  {
    icon: Users,
    title: "Teamwork",
    description:
      "We believe collaboration and shared responsibility drive better solutions and stronger results for our clients.",
  },
];

const timeline = [
  {
    year: "2007",
    title: "Established",
    description:
      "Sagaljet Digital Printing Company was established as the first and largest digital printing company in Somaliland, starting operations with one office and publication room.",
  },
  {
    year: "2010-2015",
    title: "Regional Expansion",
    description:
      "Opened branches across all regions of Somaliland, bringing quality printing services closer to clients throughout the country.",
  },
  {
    year: "2016-2020",
    title: "District Presence",
    description:
      "Expanded within Hargeisa by opening branches at various districts, bringing services right at the doors of our clients.",
  },
  {
    year: "2021",
    title: "International Growth",
    description:
      "Extended operations to Djibouti and UAE, establishing Sagaljet as a regional leader in digital printing services.",
  },
  {
    year: "2023",
    title: "Strategic Partnerships",
    description:
      "Established collaboration with sister branches: Signjet in Mogadisho, Somalia, and Horyaaljet in Garoowe, Puntland, strengthening our presence across the Horn of Africa.",
  },
];

const branches = [
  {
    region: "Somaliland",
    locations: [
      { name: "Hargeisa - Main Office", type: "headquarters" },
      { name: "Hargeisa Districts", type: "branch" },
      { name: "All Regions of Somaliland", type: "branch" },
    ],
  },
  {
    region: "International",
    locations: [
      { name: "Djibouti", type: "branch" },
      { name: "UAE", type: "branch" },
    ],
  },
  {
    region: "Sister Companies",
    locations: [
      { name: "Signjet - Mogadishu, Somalia", type: "partner" },
      { name: "Horyaaljet - Garoowe, Puntland", type: "partner" },
    ],
  },
];

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default function AboutClientPage() {
  const { data, error, isLoading } = useSWR<DataResponse>(
    `${Url}/teams/all`,
    fetcher,
  );

  const [selectedMember, setSelectedMember] = useState<DataItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMemberClick = (member: DataItem) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://sagaljet.net" },
    { name: "About", url: "https://sagaljet.net/about" },
  ]);

  const teamMembers = data?.result
    ? [...data.result].sort((a, b) => {
        if (a.order === null) return 1;
        if (b.order === null) return -1;
        return a.order - b.order;
      })
    : [];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchemaOrg schema={breadcrumbs} />

      <div className="flex flex-col">
        <HeroBanner
          type="about"
          heightClass="h-[350px] md:h-[450px]"
          ctaText="View About"
          defaultLink="/about"
          autoPlayInterval={6000}
        />
        {/* Company Story */}
        <section className="py-20 lg:px-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-6 text-balance"
              >
                Our Story
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-muted-foreground leading-relaxed text-pretty"
              >
                Sagaljet Digital Printing Company is the first and largest
                digital printing company in Somaliland. It was established in
                2007, and started operations with one office and publication
                room. After 19 years of dedication, hardwork, customer
                satisfaction and convenient service, the company now has
                branches and functioning offices in all regions of Somaliland,
                Djibouti and UAE. We have also opened branches at the districts
                of Hargeisa to bring our services right at the doors of our
                clients. Sagaljet is expanding its presence in the Horn of
                Africa and envisioning to extend its products and services to
                the region. The company practices collaboration with its sister
                branches of Signjet in Mogadisho, Somalia, and Horyaaljet in
                Garoowe, Puntland. We are dedicated and qualified in providing
                quality products of all types of printing services, including
                indoor and outdoor printing materials from business cards to 3D
                signboards and billboards.
              </motion.p>
            </div>

            {/* Team Section */}
            <section className="py-20">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center max-w-3xl mx-auto mb-16"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                    Our Team
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                    Behind every successful print job is a dedicated team of
                    professionals committed to excellence. Meet the experts who
                    make SagalJet the leading printing company in the region.
                  </p>
                </motion.div>

                {isLoading && (
                  <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#422f7e] border-r-transparent"></div>
                    <p className="mt-4 text-muted-foreground">
                      Loading team members...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-12">
                    <p className="text-red-500">
                      Failed to load team members. Please try again later.
                    </p>
                  </div>
                )}

                {/* Team Members Grid */}
                {!isLoading && !error && teamMembers.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {teamMembers.map((member, index) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card
                          className="overflow-hidden h-full group hover:shadow-xl transition-all duration-300 cursor-pointer"
                          onClick={() => handleMemberClick(member)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-48 h-48 mx-auto mt-6 overflow-hidden bg-white rounded-full"
                          >
                            <Image
                              src={member.imageUrl || "/placeholder.svg"}
                              alt={member.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#422f7e]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                          </motion.div>
                          <CardHeader className="text-center">
                            <CardTitle className="text-xl mb-1">
                              {member.name}
                            </CardTitle>
                            <CardDescription className="text-[#e20613] font-medium">
                              {member.skill}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="text-center">
                            <p className="text-muted-foreground text-sm">
                              {truncateText(member.description, 80)}
                            </p>
                            {member.description &&
                              member.description.length > 80 && (
                                <button className="text-[#422f7e] text-sm font-medium mt-2 hover:underline">
                                  Read more
                                </button>
                              )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-[#422f7e] flex items-center justify-center mb-4">
                        <value.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="leading-relaxed">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Our Journey
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                A timeline of growth, innovation, and commitment to excellence
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative pl-8 pb-12 border-l-2 border-border last:pb-0"
                >
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#e20613]" />
                  <div className="text-sm font-bold text-[#422f7e] mb-1">
                    {item.year}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Our Branches
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Serving clients across the Horn of Africa with quality printing
                services
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {branches.map((branch, index) => (
                <motion.div
                  key={branch.region}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-[#422f7e] flex items-center justify-center mb-4">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{branch.region}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {branch.locations.map((location) => (
                          <li
                            key={location.name}
                            className="flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#e20613] mt-2 flex-shrink-0" />
                            <div>
                              <p className="font-medium">{location.name}</p>
                              {location.type === "partner" && (
                                <p className="text-sm text-muted-foreground">
                                  Sister Company
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Team Member Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedMember && (
            <>
              <DialogHeader className="text-center">
                <div className="relative w-full aspect-[4/3] mx-auto mb-4 overflow-hidden rounded-md">
                  <Image
                    src={selectedMember.imageUrl || "/placeholder.svg"}
                    alt={selectedMember.name}
                    fill
                    className="object-cover bg-gray-100"
                  />
                </div>
                <DialogTitle className="text-2xl font-bold text-center">
                  {selectedMember.name}
                </DialogTitle>
                <DialogDescription className="text-[#e20613] font-medium text-center text-base">
                  {selectedMember.skill}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-muted-foreground leading-relaxed text-center">
                  {selectedMember.description}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Suspense>
  );
}
