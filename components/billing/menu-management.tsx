
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  Search,
  X,
} from "lucide-react";

import { useMenuStore } from "@/stores/menu.store";
import {
  FOOD_CATEGORIES,
  type FoodCategory,
  type FoodItem,
} from "@/features/billing/menu.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type MenuFormValues = {
  name: string;
  price: number;
  category: FoodCategory;
  available: "true" | "false";
};

type SortField = "name" | "category" | "price" | "available";
type CategoryFilter = "All" | FoodCategory;
type AvailabilityFilter = "All" | "Available" | "Unavailable";
type PendingAction = "add" | "edit" | "delete" | null;

const categories = FOOD_CATEGORIES;

const defaultFormValues: MenuFormValues = {
  name: "",
  price: 0,
  category: "Tiffin",
  available: "true",
};

export function MenuManagement() {
  const {
    menuItems,
    loadMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
  } = useMenuStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] =
    useState<PendingAction>(null);
  const [pendingDeleteItem, setPendingDeleteItem] =
    useState<FoodItem | null>(null);
  const [pendingFormValues, setPendingFormValues] =
    useState<MenuFormValues | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("All");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("All");

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortAscending, setSortAscending] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MenuFormValues>({
    defaultValues: defaultFormValues,
  });

  const selectedCategory = watch("category");
  const selectedAvailability = watch("available");

  useEffect(() => {
    try {
      loadMenu();
    } catch {
      toast.error("Failed to load food items!", {
        description: "Unable to load your menu. Please try again.",
      });
    }
  }, [loadMenu]);

  const sortedItems = useMemo(() => {
    return [...menuItems].sort((a, b) => {
      let result = 0;

      switch (sortField) {
        case "name":
          result = a.name.localeCompare(b.name);
          break;
        case "category":
          result = a.category.localeCompare(b.category);
          break;
        case "price":
          result = a.price - b.price;
          break;
        case "available":
          result = Number(a.available) - Number(b.available);
          break;
      }

      return sortAscending ? result : -result;
    });
  }, [menuItems, sortField, sortAscending]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return sortedItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "All" ||
        (availabilityFilter === "Available" && item.available) ||
        (availabilityFilter === "Unavailable" && !item.available);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });
  }, [
    sortedItems,
    searchTerm,
    categoryFilter,
    availabilityFilter,
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAscending((previous) => !previous);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
  };

  const openAddDialog = () => {
    setEditingItem(null);
    reset(defaultFormValues);
    setDialogOpen(true);
  };

  const openEditDialog = (item: FoodItem) => {
    setEditingItem(item);

    reset({
      name: item.name,
      price: item.price,
      category: item.category,
      available: item.available ? "true" : "false",
    });

    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    reset(defaultFormValues);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      setEditingItem(null);
      reset(defaultFormValues);
    }
  };

  const onSubmit = (values: MenuFormValues) => {
    const name = values.name.trim();
    const price = Number(values.price);

    if (!name || !Number.isFinite(price) || price <= 0) {
      toast.error("Please check the food item details.", {
        description: "Enter a food name and a price greater than zero.",
      });
      return;
    }

    setPendingFormValues({
      ...values,
      name,
      price,
    });

    setPendingDeleteItem(null);
    setPendingAction(editingItem ? "edit" : "add");
    setConfirmOpen(true);
  };

  const handleDelete = (item: FoodItem) => {
    setPendingDeleteItem(item);
    setPendingFormValues(null);
    setPendingAction("delete");
    setConfirmOpen(true);
  };

  const clearConfirmation = () => {
    setConfirmOpen(false);
    setPendingAction(null);
    setPendingDeleteItem(null);
    setPendingFormValues(null);
  };

  const handleConfirmAction = () => {
    try {
      if (pendingAction === "delete" && pendingDeleteItem) {
        const itemName = pendingDeleteItem.name;
        deleteMenuItem(pendingDeleteItem.id);

        toast.success("Food item deleted successfully!", {
          description: `"${itemName}" has been removed from your menu.`,
        });

        clearConfirmation();
        return;
      }

      if (pendingAction === "add" && pendingFormValues) {
        const values = pendingFormValues;

        addMenuItem({
          id: Date.now(),
          name: values.name,
          price: values.price,
          category: values.category,
          available: values.available === "true",
        });

        toast.success("Food item added successfully!", {
          description: `"${values.name}" has been added to your menu.`,
        });

        clearConfirmation();
        closeDialog();
        return;
      }

      if (
        pendingAction === "edit" &&
        pendingFormValues &&
        editingItem
      ) {
        const values = pendingFormValues;

        updateMenuItem(editingItem.id, {
          name: values.name,
          price: values.price,
          category: values.category,
          available: values.available === "true",
        });

        toast.success("Food item updated successfully!", {
          description: `"${values.name}" has been updated.`,
        });

        clearConfirmation();
        closeDialog();
        return;
      }

      toast.error("Operation failed!", {
        description: "Unable to complete the operation. Please try again.",
      });

      clearConfirmation();
    } catch {
      toast.error("Something went wrong!", {
        description: "Your action could not be completed. Please try again.",
      });
    }
  };

  const handleToggleAvailability = (item: FoodItem) => {
    try {
      toggleAvailability(item.id);

      toast.success(
        item.available
          ? "Food item marked unavailable!"
          : "Food item marked available!",
        {
          description: item.name,
        },
      );
    } catch {
      toast.error("Availability update failed!", {
        description: `Could not update "${item.name}". Please try again.`,
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setAvailabilityFilter("All");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    categoryFilter !== "All" ||
    availabilityFilter !== "All";

  const confirmation = {
    add: {
      title: "Add Food Item?",
      description: `Are you sure you want to add "${pendingFormValues?.name ?? ""}" to your menu?`,
      confirmText: "Yes, Add Item",
    },
    edit: {
      title: "Save Changes?",
      description: `Are you sure you want to save the changes to "${pendingFormValues?.name ?? ""}"?`,
      confirmText: "Save Changes",
    },
    delete: {
      title: "Delete Food Item?",
      description: `Are you sure you want to delete "${pendingDeleteItem?.name ?? ""}"? This action cannot be undone.`,
      confirmText: "Yes, Delete",
    },
  };

  const currentConfirmation =
    pendingAction !== null ? confirmation[pendingAction] : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Food Items
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your hotel menu, prices and availability.
          </p>
        </div>

        <Button
          type="button"
          onClick={openAddDialog}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Food Item
        </Button>
      </div>

      <div className="space-y-4 rounded-xl border border-green-100 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search food items..."
              aria-label="Search food items"
              className="border-gray-300 pl-9 pr-9 focus-visible:border-green-600 focus-visible:ring-green-600"
            />

            {searchTerm && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(value) =>
              setCategoryFilter(value as CategoryFilter)
            }
          >
            <SelectTrigger
              aria-label="Filter by category"
              className="border-gray-300 focus:ring-green-600"
            >
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={availabilityFilter}
            onValueChange={(value) =>
              setAvailabilityFilter(value as AvailabilityFilter)
            }
          >
            <SelectTrigger
              aria-label="Filter by availability"
              className="border-gray-300 focus:ring-green-600"
            >
              <SelectValue placeholder="Filter by availability" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">All Availability</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Unavailable">Not Available</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-green-50 pt-3">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-green-700">
              {filteredItems.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-700">
              {menuItems.length}
            </span>{" "}
            food items
          </p>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-green-700 hover:bg-green-50 hover:text-green-800"
            >
              <X className="mr-1 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-green-100 bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-green-50">
            <tr>
              <th className="px-5 py-4 text-left font-semibold text-green-950">
                <button
                  type="button"
                  onClick={() => handleSort("name")}
                  className="inline-flex items-center gap-2"
                >
                  Food Name
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>

              <th className="px-5 py-4 text-left font-semibold text-green-950">
                <button
                  type="button"
                  onClick={() => handleSort("category")}
                  className="inline-flex items-center gap-2"
                >
                  Category
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>

              <th className="px-5 py-4 text-left font-semibold text-green-950">
                <button
                  type="button"
                  onClick={() => handleSort("price")}
                  className="inline-flex items-center gap-2"
                >
                  Price
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>

              <th className="px-5 py-4 text-left font-semibold text-green-950">
                <button
                  type="button"
                  onClick={() => handleSort("available")}
                  className="inline-flex items-center gap-2"
                >
                  Availability
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>

              <th className="px-5 py-4 text-left font-semibold text-green-950">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-green-50">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-gray-300" />

                    <p className="font-medium text-gray-700">
                      No food items found
                    </p>

                    <p className="text-sm text-gray-500">
                      Try changing your search or filters.
                    </p>

                    {hasActiveFilters && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="mt-2 border-green-200 text-green-700 hover:bg-green-50"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-green-50/50"
                >
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {item.name}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.category}
                  </td>

                  <td className="px-5 py-4 font-semibold text-green-700">
                    ₹{item.price.toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(item)}
                      aria-label={`Change availability for ${item.name}`}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        item.available
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {item.available ? "Available" : "Not Available"}
                    </button>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Edit ${item.name}`}
                        onClick={() => openEditDialog(item)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => handleDelete(item)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Food Item" : "Add Food Item"}
            </DialogTitle>

            <DialogDescription>
              Enter the food name, price, category and availability.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="food-name">Food Name</Label>

              <Input
                id="food-name"
                placeholder="e.g. Plain Dosa"
                {...register("name", {
                  required: "Food name is required",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Food name cannot be empty",
                })}
              />

              {errors.name && (
                <p className="text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="food-price">Price (₹)</Label>

              <Input
                id="food-price"
                type="number"
                min="0.01"
                step="0.01"
                {...register("price", {
                  valueAsNumber: true,
                  required: "Price is required",
                  min: {
                    value: 0.01,
                    message: "Price must be greater than zero",
                  },
                  validate: (value) =>
                    Number.isFinite(value) || "Enter a valid price",
                })}
              />

              {errors.price && (
                <p className="text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>

              <Select
                value={selectedCategory}
                onValueChange={(value) =>
                  setValue("category", value as FoodCategory, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Availability</Label>

              <Select
                value={selectedAvailability}
                onValueChange={(value) =>
                  setValue(
                    "available",
                    value as "true" | "false",
                    { shouldValidate: true },
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose availability" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {editingItem ? "Save Changes" : "Add Food Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            clearConfirmation();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {currentConfirmation?.title}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {currentConfirmation?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={clearConfirmation}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleConfirmAction();
              }}
              className={
                pendingAction === "delete"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }
            >
              {currentConfirmation?.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
