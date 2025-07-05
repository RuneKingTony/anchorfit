
import ProductSection from "./ProductSection";
import { Product } from "@/contexts/CartContext";

const NewlyReleased = () => {
  const newProducts: Product[] = [
    {
      id: "1",
      name: "Shut Up and Squat",
      price: 32000, // Black variant price
      image: "/lovable-uploads/c35dda04-fe24-4c0b-8122-930a3a5f47de.png",
      images: {
        "Black": "/lovable-uploads/c35dda04-fe24-4c0b-8122-930a3a5f47de.png",
        "Acid Washed": "/lovable-uploads/9ddb7aa3-f579-48f7-8e7f-d8d717370bf2.png",
      },
      prices: {
        "Black": 32000,
        "Acid Washed": 35000,
      },
      size: "M",
      color: "Black",
    },
    {
      id: "2", 
      name: "Certified Muscle Mummy",
      price: 32000, // Black variant price
      image: "/lovable-uploads/9a3dab61-477f-494f-b8b1-3af34d208d63.png",
      images: {
        "Black": "/lovable-uploads/9a3dab61-477f-494f-b8b1-3af34d208d63.png",
        "Acid Washed": "/lovable-uploads/eb499c8a-676a-4429-a542-44856fbdfec5.png",
      },
      prices: {
        "Black": 32000,
        "Acid Washed": 35000,
      },
      size: "L",
      color: "Black",
    },
    {
      id: "3",
      name: "Stronger Than Your Boyfriend",
      price: 32000, // Black variant price
      image: "/lovable-uploads/fa33d5e3-bdc8-4fd0-b2db-0e33b90afe50.png", 
      images: {
        "Black": "/lovable-uploads/fa33d5e3-bdc8-4fd0-b2db-0e33b90afe50.png",
        "Acid Washed": "/lovable-uploads/f9e19f36-a2f4-41be-9771-9bf9caeb48ab.png",
      },
      prices: {
        "Black": 32000,
        "Acid Washed": 35000,
      },
      size: "XL",
      color: "Black",
    }
  ];

  return (
    <ProductSection
      id="newly-released"
      title="🔥 New Releases"
      subtitle="Fresh drops from the Arrogant Lifter Collection"
      products={newProducts}
      showNewBadge={true}
      showViewAllButton={true}
      viewAllLink="#products"
      backgroundColor="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
      backgroundImage="/lovable-uploads/f9412b09-9c9f-4feb-8023-f7ca22cdc58c.png"
    />
  );
};

export default NewlyReleased;
