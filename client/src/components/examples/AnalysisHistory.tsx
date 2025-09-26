import AnalysisHistory from '../AnalysisHistory';
import productImage from '@assets/generated_images/Product_ingredient_examples_313bd162.png';

//todo: remove mock functionality - replace with real data from backend
const mockRecords = [
  {
    id: "1",
    productName: "Vitamin C Serum",
    imageUrl: productImage,
    analyzedAt: "2024-01-15T10:30:00Z",
    summary: {
      excellent: 8,
      good: 3,
      notbad: 1,
      bad: 0
    },
    topConcerns: ["Fragrance sensitivity", "High concentration"]
  },
  {
    id: "2", 
    productName: "Daily Moisturizer",
    imageUrl: productImage,
    analyzedAt: "2024-01-12T14:20:00Z",
    summary: {
      excellent: 5,
      good: 4,
      notbad: 2,
      bad: 1
    },
    topConcerns: ["Alcohol content", "Comedogenic oils"]
  },
  {
    id: "3",
    productName: "Acne Treatment Gel",
    imageUrl: productImage,
    analyzedAt: "2024-01-10T09:15:00Z",
    summary: {
      excellent: 2,
      good: 3,
      notbad: 4,
      bad: 3
    },
    topConcerns: ["Drying agents", "Sulfates", "Harsh preservatives"]
  },
  {
    id: "4",
    productName: "Gentle Cleanser",
    imageUrl: productImage,
    analyzedAt: "2024-01-08T16:45:00Z",
    summary: {
      excellent: 7,
      good: 2,
      notbad: 1,
      bad: 0
    },
    topConcerns: []
  },
  {
    id: "5",
    productName: "Night Cream",
    imageUrl: productImage,
    analyzedAt: "2024-01-05T20:30:00Z",
    summary: {
      excellent: 4,
      good: 6,
      notbad: 3,
      bad: 2
    },
    topConcerns: ["Artificial fragrance", "Heavy oils"]
  },
  {
    id: "6",
    productName: "Sunscreen SPF 50",
    imageUrl: productImage,
    analyzedAt: "2024-01-03T11:00:00Z",
    summary: {
      excellent: 9,
      good: 4,
      notbad: 1,
      bad: 0
    },
    topConcerns: ["White cast potential"]
  }
];

export default function AnalysisHistoryExample() {
  const handleViewRecord = (id: string) => {
    console.log('Viewing record:', id);
    alert(`Viewing analysis for record ${id}. This would navigate to detailed view.`);
  };

  const handleDeleteRecord = (id: string) => {
    console.log('Deleting record:', id);
    if (confirm('Are you sure you want to delete this analysis?')) {
      alert(`Record ${id} deleted!`);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-background">
      <AnalysisHistory
        records={mockRecords}
        onViewRecord={handleViewRecord}
        onDeleteRecord={handleDeleteRecord}
      />
    </div>
  );
}