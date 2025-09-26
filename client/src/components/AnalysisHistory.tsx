import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar, 
  Eye, 
  Trash2, 
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";

interface AnalysisRecord {
  id: string;
  productName: string;
  imageUrl: string;
  analyzedAt: string;
  summary: {
    excellent: number;
    good: number;
    notbad: number;
    bad: number;
  };
  topConcerns: string[];
}

interface AnalysisHistoryProps {
  records: AnalysisRecord[];
  onViewRecord: (id: string) => void;
  onDeleteRecord: (id: string) => void;
}

export default function AnalysisHistory({ records, onViewRecord, onDeleteRecord }: AnalysisHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "safe" | "warning">("all");

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.topConcerns.some(concern => 
                           concern.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    if (!matchesSearch) return false;

    if (filterBy === "safe") {
      return record.summary.excellent + record.summary.good > record.summary.notbad + record.summary.bad;
    }
    if (filterBy === "warning") {
      return record.summary.notbad + record.summary.bad > record.summary.excellent + record.summary.good;
    }
    
    return true;
  });

  const getOverallSafety = (summary: AnalysisRecord['summary']) => {
    const safe = summary.excellent + summary.good;
    const unsafe = summary.notbad + summary.bad;
    
    if (safe > unsafe) return "safe";
    if (unsafe > safe) return "warning";
    return "mixed";
  };

  const getSafetyIcon = (safety: string) => {
    switch (safety) {
      case "safe": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Search */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
          <p className="text-muted-foreground">
            Review your past product analyses and track your skincare journey
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-history"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterBy === "all" ? "default" : "outline"}
              onClick={() => setFilterBy("all")}
              size="sm"
              data-testid="button-filter-all"
            >
              <Filter className="w-4 h-4 mr-2" />
              All
            </Button>
            <Button
              variant={filterBy === "safe" ? "default" : "outline"}
              onClick={() => setFilterBy("safe")}
              size="sm"
              data-testid="button-filter-safe"
            >
              Safe
            </Button>
            <Button
              variant={filterBy === "warning" ? "default" : "outline"}
              onClick={() => setFilterBy("warning")}
              size="sm"
              data-testid="button-filter-warning"
            >
              Warning
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{records.length}</div>
              <div className="text-sm text-muted-foreground">Total Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {records.filter(r => getOverallSafety(r.summary) === "safe").length}
              </div>
              <div className="text-sm text-muted-foreground">Safe Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {records.filter(r => getOverallSafety(r.summary) === "mixed").length}
              </div>
              <div className="text-sm text-muted-foreground">Mixed Results</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {records.filter(r => getOverallSafety(r.summary) === "warning").length}
              </div>
              <div className="text-sm text-muted-foreground">With Warnings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No analyses found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterBy !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Start analyzing products to build your history"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => {
            const overallSafety = getOverallSafety(record.summary);
            
            return (
              <Card key={record.id} className="hover-elevate transition-all">
                <CardHeader className="pb-3">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-muted mb-3">
                    <img
                      src={record.imageUrl}
                      alt={record.productName}
                      className="w-full h-full object-cover"
                      data-testid={`img-product-${record.id}`}
                    />
                    <div className="absolute top-2 right-2">
                      {getSafetyIcon(overallSafety)}
                    </div>
                  </div>
                  
                  <CardTitle className="text-base" data-testid={`title-product-${record.id}`}>
                    {record.productName}
                  </CardTitle>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(record.analyzedAt).toLocaleDateString()}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Safety Summary */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-green-600">Excellent:</span>
                      <span data-testid={`count-excellent-${record.id}`}>{record.summary.excellent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-500">Good:</span>
                      <span data-testid={`count-good-${record.id}`}>{record.summary.good}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-500">Not Bad:</span>
                      <span data-testid={`count-notbad-${record.id}`}>{record.summary.notbad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-500">Bad:</span>
                      <span data-testid={`count-bad-${record.id}`}>{record.summary.bad}</span>
                    </div>
                  </div>

                  {/* Top Concerns */}
                  {record.topConcerns.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Top Concerns:</div>
                      <div className="flex flex-wrap gap-1">
                        {record.topConcerns.slice(0, 2).map((concern, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {concern}
                          </Badge>
                        ))}
                        {record.topConcerns.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{record.topConcerns.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewRecord(record.id)}
                      className="flex-1"
                      data-testid={`button-view-${record.id}`}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteRecord(record.id)}
                      className="text-destructive hover:text-destructive"
                      data-testid={`button-delete-${record.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}