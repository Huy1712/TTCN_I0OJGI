import React from "react";
import { BrandStorySection } from "./components/BrandStorySection";
import { CollectionStorySection } from "./components/CollectionStorySection";
import { CustomDesignCTA } from "./components/CustomDesignCTA";
import { FeaturedProductsSection } from "./components/FeaturedProductsSection";
import { HeroCinematic } from "./components/HeroCinematic";
import {
  HOME_PREVIEW_COLLECTION,
  HOME_PREVIEW_PRODUCTS,
} from "./homeFixtures";
import "./home.css";

export const HomePage: React.FC = () => {
  return (
    <div>
      <HeroCinematic />
      <FeaturedProductsSection products={HOME_PREVIEW_PRODUCTS} />
      <CollectionStorySection collection={HOME_PREVIEW_COLLECTION} />
      <BrandStorySection />
      <CustomDesignCTA />
    </div>
  );
};
