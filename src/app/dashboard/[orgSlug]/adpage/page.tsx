"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { Plus, Megaphone, MoreHorizontal, Edit, Trash2, Globe, Clock, Copy } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock Data representing saved Ad Pages
const INITIAL_AD_PAGES: any[] = [];

import { getAdPages, updateAdPageStatus, deleteAdPage } from "@/actions/adpages";
import { toast } from "sonner"; // Using standard alert for now, but importing toast if needed, wait we removed toast earlier, let's keep it clean

export default function AdPagesList({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = use(params);
  const [ads, setAds] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const data = await getAdPages(orgSlug);
      setAds(data || []);
      setLoading(false);
    }
    loadData();
  }, [orgSlug]);

  const handlePublish = async (id: string) => {
    try {
      await updateAdPageStatus(id, orgSlug, "published");
      setAds((prev) => prev.map(ad => ad.id === id ? { ...ad, status: "published" } : ad));
      alert("Ad page is now live!");
    } catch (e) {
      alert("Failed to publish");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdPage(id, orgSlug);
      setAds((prev) => prev.filter(ad => ad.id !== id));
      alert("Ad page deleted");
    } catch (e) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ad Pages</h2>
          <p className="text-muted-foreground">Manage your promotional pages and campaigns.</p>
        </div>
        <Link href={`/dashboard/${orgSlug}/adpage/new`}>
          <Button className="gap-2 shadow-md">
            <Plus className="h-4 w-4" />
            Create Ad Page
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => (
          <Card key={ad.id} className="flex flex-col">
            <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-primary" />
                  {ad.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Created {ad.createdAt}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" /> Edit Page
                  </DropdownMenuItem>
                  {ad.status === "published" ? (
                    <DropdownMenuItem onClick={() => {
                      navigator.clipboard.writeText(`https://esporthub.com/ad/${ad.id}`);
                      alert("Link copied to clipboard!");
                    }}>
                      <Copy className="mr-2 h-4 w-4" /> Copy Link
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => handlePublish(ad.id)}>
                      <Globe className="mr-2 h-4 w-4" /> Publish
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDelete(ad.id)} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {ad.status === "published" ? (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/20">
                    <Globe className="mr-1 h-3 w-3" /> Live
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    Draft
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="mt-auto pt-4 flex items-center justify-between border-t text-sm text-muted-foreground bg-muted/20">
              <div>
                <span className="font-medium text-foreground">{ad.views}</span> Views
              </div>
              <div>
                <span className="font-medium text-foreground">{ad.clicks}</span> Clicks
              </div>
            </CardFooter>
          </Card>
        ))}

        {/* Create New Placeholder Card */}
        <Link href={`/dashboard/${orgSlug}/adpage/new`}>
          <Card className="flex flex-col h-full justify-center items-center p-6 border-dashed hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer text-muted-foreground hover:text-foreground">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg">Create New Ad Page</h3>
            <p className="text-sm text-center mt-1">Start from a template or build from scratch.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
