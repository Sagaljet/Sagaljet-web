"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// Utility function to strip HTML tags for length calculation
const stripHtmlTags = (html: any) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

// Utility function to truncate HTML content while preserving structure
const truncateHtml = (html: any, maxLength: any) => {
  const plainText = stripHtmlTags(html);
  if (plainText.length <= maxLength) return html;

  // Create a temporary div to work with the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  let currentLength = 0;
  let truncatedHtml = "";

  const walkNodes = (node: any) => {
    if (currentLength >= maxLength) return false;

    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent || "";
      const remainingLength = maxLength - currentLength;

      if (textContent.length <= remainingLength) {
        truncatedHtml += textContent;
        currentLength += textContent.length;
      } else {
        truncatedHtml += textContent.substring(0, remainingLength) + "...";
        currentLength = maxLength;
        return false;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node;
      truncatedHtml += `<${element.tagName.toLowerCase()}`;

      // Add attributes
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        truncatedHtml += ` ${attr.name}="${attr.value}"`;
      }
      truncatedHtml += ">";

      // Process child nodes
      for (let i = 0; i < node.childNodes.length; i++) {
        if (!walkNodes(node.childNodes[i])) break;
      }

      truncatedHtml += `</${element.tagName.toLowerCase()}>`;
    }

    return true;
  };

  // Walk through all nodes
  for (let i = 0; i < tempDiv.childNodes.length; i++) {
    if (!walkNodes(tempDiv.childNodes[i])) break;
  }

  return truncatedHtml;
};

export default function ProjectDescription({
  description = "",
  maxLength = 150,
  className = "",
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const plainTextLength = stripHtmlTags(description).length;
  const shouldTruncate = plainTextLength > maxLength;

  const displayContent =
    shouldTruncate && !isExpanded
      ? truncateHtml(description, maxLength)
      : description;

  return (
    <div className={className}>
      <div
        className="prose prose-sm max-w-none text-inherit
          prose-headings:text-inherit prose-headings:font-semibold prose-headings:my-1
          prose-p:text-inherit prose-p:my-1 prose-p:leading-relaxed
          prose-strong:text-inherit prose-strong:font-semibold
          prose-em:text-inherit
          prose-ul:text-inherit prose-ol:text-inherit prose-ul:my-1 prose-ol:my-1
          prose-li:text-inherit prose-li:my-0
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />

      {shouldTruncate && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800 mt-1"
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
}
