// OriginalName: BrandHPList
// ShortName: BHPList

/**
 * 🔷 BLUEPRINT: MASTER BRAND HP LIST
 * 
 * Brand HP adalah MASTER PASIF:
 * - TIDAK punya stok
 * - TIDAK punya ledger
 * - DIPAKAI di dropdown nota service & observasi AI (Mode B)
 * 
 * UI Features:
 * - Stats: Total, Aktif, Nonaktif, Digunakan
 * - Filter: Search, Status (Semua/Aktif/Nonaktif)
 * - Actions: Edit, Toggle Aktif/Nonaktif (NO DELETE)
 */

import { useState, useMemo } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Plus,
  Search,
  Edit,
  Power,
  PowerOff,
  Smartphone,
  Activity,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useBrandHP } from "../../../hooks/useBrandHP";
import BHPForm from "./Form";
import type { PhoneBrand } from "../../../types/inventory";

export default function BHPList() {
  const {
    brands,
    stats,
    addBrand,
    updateBrand,
    toggleActive,
    getUsageInfo,
  } = useBrandHP();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<PhoneBrand | null>(null);

  // 🔷 BLUEPRINT: Filter brands
  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      // Filter by status
      if (filterStatus === "active" && !b.is_active)
        return false;
      if (filterStatus === "inactive" && b.is_active)
        return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(query) ||
          b.slug?.toLowerCase().includes(query) ||
          b.notes?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [brands, searchQuery, filterStatus]);

  const handleAdd = () => {
    setEditingBrand(null);
    setIsFormOpen(true);
  };

  const handleEdit = (brand: PhoneBrand) => {
    setEditingBrand(brand);
    setIsFormOpen(true);
  };

  // 🔧 FIX: Simplify toggle - no fake safety, no condition
  const handleToggleActive = (brand: PhoneBrand) => {
    toggleActive(brand.id);
    toast.success(
      brand.is_active
        ? `Brand "${brand.name}" dinonaktifkan`
        : `Brand "${brand.name}" diaktifkan`
    );
  };

  // 🔧 FIX: Atomic update - no side-effect ganda
  const handleSubmit = (data: {
    name: string;
    notes?: string;
    is_active: boolean;
  }) => {
    try {
      if (editingBrand) {
        // Atomic update
        updateBrand(editingBrand.id, {
          name: data.name,
          notes: data.notes,
          is_active: data.is_active,
        });
        toast.success("Brand berhasil diupdate");
      } else {
        // Create new
        const newBrand = addBrand(data.name, data.notes);
        
        // Set status jika bukan default (true)
        if (data.is_active === false) {
          toggleActive(newBrand.id);
        }
        
        toast.success("Brand berhasil ditambahkan");
      }
      setIsFormOpen(false);
      setEditingBrand(null);
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan brand");
    }
  };

  return (
    <div className="space-y-4">
      {/* 🔷 BLUEPRINT: Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Total Brand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              Nonaktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-orange-600">
              {stats.inactive}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Digunakan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">
              {stats.used}
            </div>
            <p className="text-xs text-muted-foreground">
              Di produk/nota
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Brand HP</CardTitle>
              <CardDescription>
                Kelola brand HP untuk kompatibilitas sparepart
                dan analisis
              </CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Brand
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 🔷 BLUEPRINT: Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(v: any) => setFilterStatus(v)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">
                  Nonaktif
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredBrands.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>
                {searchQuery || filterStatus !== "all"
                  ? "Tidak ada brand yang sesuai filter"
                  : "Belum ada brand HP"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredBrands.map((brand) => {
                // 🔧 FIX: getUsageInfo instead of canDelete
                const usage = getUsageInfo(brand);

                return (
                  <Card
                    key={brand.id}
                    className={
                      !brand.is_active ? "opacity-60" : ""
                    }
                  >
                    <CardHeader className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-sm flex items-center gap-2">
                              {brand.name}
                              {!brand.is_active && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Nonaktif
                                </Badge>
                              )}
                              {usage.isUsed && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                >
                                  Digunakan
                                </Badge>
                              )}
                            </CardTitle>
                            {brand.notes && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {brand.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 pt-2 border-t">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 flex-1"
                            onClick={() => handleEdit(brand)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              brand.is_active
                                ? "ghost"
                                : "outline"
                            }
                            className="h-8 flex-1"
                            onClick={() =>
                              handleToggleActive(brand)
                            }
                          >
                            {brand.is_active ? (
                              <>
                                <PowerOff className="w-3 h-3 mr-1" />
                                Nonaktifkan
                              </>
                            ) : (
                              <>
                                <Power className="w-3 h-3 mr-1" />
                                Aktifkan
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <BHPForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBrand(null);
        }}
        onSubmit={handleSubmit}
        editingBrand={editingBrand}
      />
    </div>
  );
}