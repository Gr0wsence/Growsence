import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
import type { User, Course, Withdrawal, AffiliateEarning } from "@shared/schema";

export default function Admin() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      setLocation("/login");
    } else if (user.role !== "admin") {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: user?.role === "admin",
  });

  // Fetch all users
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === "admin",
  });

  // Fetch all courses
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: user?.role === "admin",
  });

  // Fetch all withdrawals
  const { data: withdrawals = [] } = useQuery<Withdrawal[]>({
    queryKey: ["/api/admin/withdrawals"],
    enabled: user?.role === "admin",
  });

  // Fetch all earnings
  const { data: earnings = [] } = useQuery<AffiliateEarning[]>({
    queryKey: ["/api/admin/earnings"],
    enabled: user?.role === "admin",
  });

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    package: "basic",
    duration: "",
    order: "",
    videoUrl: "",
    pdfUrl: ""
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/courses", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      setIsCreateCourseOpen(false);
      setCourseForm({
        title: "",
        description: "",
        category: "",
        package: "basic",
        duration: "",
        order: "",
        videoUrl: "",
        pdfUrl: ""
      });
      toast({
        title: "Course created",
        description: "New course has been added successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", `/api/admin/courses/${selectedCourse?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      setIsEditCourseOpen(false);
      setSelectedCourse(null);
      toast({
        title: "Course updated",
        description: "Course has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      return apiRequest("DELETE", `/api/admin/courses/${courseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({
        title: "Course deleted",
        description: "Course has been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Process withdrawal mutation
  const processWithdrawalMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PUT", `/api/admin/withdrawals/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] });
      toast({
        title: "Withdrawal processed",
        description: "Withdrawal status has been updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate({
      ...courseForm,
      duration: parseInt(courseForm.duration),
      order: parseInt(courseForm.order),
      isActive: true
    });
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    updateCourseMutation.mutate({
      ...courseForm,
      duration: parseInt(courseForm.duration),
      order: parseInt(courseForm.order)
    });
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description || "",
      category: course.category,
      package: course.package,
      duration: course.duration?.toString() || "",
      order: course.order?.toString() || "",
      videoUrl: course.videoUrl || "",
      pdfUrl: course.pdfUrl || ""
    });
    setIsEditCourseOpen(true);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingWithdrawals = withdrawals.filter(w => w.status === "pending");
  const completedWithdrawals = withdrawals.filter(w => w.status === "completed");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your platform, users, and content
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Users</p>
                      <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-100" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Courses</p>
                      <p className="text-3xl font-bold">{stats?.totalCourses || 0}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-green-100" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Total Earnings</p>
                      <p className="text-3xl font-bold">₹{stats?.totalEarnings || 0}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-100" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Active Enrollments</p>
                      <p className="text-3xl font-bold">{stats?.activeEnrollments || 0}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-100" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage all registered users</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.package ? (
                              <Badge variant={user.package === "pro" ? "default" : "secondary"}>
                                {user.package}
                              </Badge>
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </TableCell>
                          <TableCell>₹{parseFloat(user.totalEarnings).toFixed(2)}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? "default" : "secondary"}>
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Course Management</CardTitle>
                      <CardDescription>Manage all courses and content</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          placeholder="Search courses..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Course
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Create New Course</DialogTitle>
                            <DialogDescription>
                              Add a new course to your platform
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="title">Course Title</Label>
                                <Input
                                  id="title"
                                  value={courseForm.title}
                                  onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="category">Category</Label>
                                <Input
                                  id="category"
                                  value={courseForm.category}
                                  onChange={(e) => setCourseForm({...courseForm, category: e.target.value})}
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={courseForm.description}
                                onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="package">Package</Label>
                                <Select
                                  value={courseForm.package}
                                  onValueChange={(value) => setCourseForm({...courseForm, package: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="basic">Basic</SelectItem>
                                    <SelectItem value="pro">Pro</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="duration">Duration (minutes)</Label>
                                <Input
                                  id="duration"
                                  type="number"
                                  value={courseForm.duration}
                                  onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="order">Order</Label>
                                <Input
                                  id="order"
                                  type="number"
                                  value={courseForm.order}
                                  onChange={(e) => setCourseForm({...courseForm, order: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="videoUrl">Video URL</Label>
                                <Input
                                  id="videoUrl"
                                  value={courseForm.videoUrl}
                                  onChange={(e) => setCourseForm({...courseForm, videoUrl: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="pdfUrl">PDF URL</Label>
                                <Input
                                  id="pdfUrl"
                                  value={courseForm.pdfUrl}
                                  onChange={(e) => setCourseForm({...courseForm, pdfUrl: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" onClick={() => setIsCreateCourseOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit" disabled={createCourseMutation.isPending}>
                                {createCourseMutation.isPending ? "Creating..." : "Create Course"}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell>{course.category}</TableCell>
                          <TableCell>
                            <Badge variant={course.package === "pro" ? "default" : "secondary"}>
                              {course.package}
                            </Badge>
                          </TableCell>
                          <TableCell>{course.duration} min</TableCell>
                          <TableCell>{course.order}</TableCell>
                          <TableCell>
                            <Badge variant={course.isActive ? "default" : "secondary"}>
                              {course.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditCourse(course)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteCourseMutation.mutate(course.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Edit Course Dialog */}
              <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                    <DialogDescription>
                      Update course information
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpdateCourse} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-title">Course Title</Label>
                        <Input
                          id="edit-title"
                          value={courseForm.title}
                          onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-category">Category</Label>
                        <Input
                          id="edit-category"
                          value={courseForm.category}
                          onChange={(e) => setCourseForm({...courseForm, category: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edit-package">Package</Label>
                        <Select
                          value={courseForm.package}
                          onValueChange={(value) => setCourseForm({...courseForm, package: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-duration">Duration (minutes)</Label>
                        <Input
                          id="edit-duration"
                          type="number"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-order">Order</Label>
                        <Input
                          id="edit-order"
                          type="number"
                          value={courseForm.order}
                          onChange={(e) => setCourseForm({...courseForm, order: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-videoUrl">Video URL</Label>
                        <Input
                          id="edit-videoUrl"
                          value={courseForm.videoUrl}
                          onChange={(e) => setCourseForm({...courseForm, videoUrl: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-pdfUrl">PDF URL</Label>
                        <Input
                          id="edit-pdfUrl"
                          value={courseForm.pdfUrl}
                          onChange={(e) => setCourseForm({...courseForm, pdfUrl: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsEditCourseOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={updateCourseMutation.isPending}>
                        {updateCourseMutation.isPending ? "Updating..." : "Update Course"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Withdrawals Tab */}
            <TabsContent value="withdrawals" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Withdrawals</CardTitle>
                    <CardDescription>
                      {pendingWithdrawals.length} requests awaiting approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingWithdrawals.map((withdrawal) => (
                        <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">₹{parseFloat(withdrawal.amount).toFixed(2)}</div>
                            <div className="text-sm text-gray-500">
                              User ID: {withdrawal.userId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(withdrawal.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => processWithdrawalMutation.mutate({ id: withdrawal.id, status: "completed" })}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => processWithdrawalMutation.mutate({ id: withdrawal.id, status: "cancelled" })}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                      {pendingWithdrawals.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No pending withdrawals
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Withdrawals</CardTitle>
                    <CardDescription>
                      Recently processed withdrawals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {completedWithdrawals.slice(0, 10).map((withdrawal) => (
                        <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">₹{parseFloat(withdrawal.amount).toFixed(2)}</div>
                            <div className="text-sm text-gray-500">
                              User ID: {withdrawal.userId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(withdrawal.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge variant="default">
                            {withdrawal.status}
                          </Badge>
                        </div>
                      ))}
                      {completedWithdrawals.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No completed withdrawals
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Affiliate Earnings Overview</CardTitle>
                  <CardDescription>
                    Track all affiliate earnings and commissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {earnings.map((earning) => (
                        <TableRow key={earning.id}>
                          <TableCell>User #{earning.userId}</TableCell>
                          <TableCell>
                            <Badge variant={earning.type === "direct" ? "default" : "secondary"}>
                              {earning.type}
                            </Badge>
                          </TableCell>
                          <TableCell>₹{parseFloat(earning.amount).toFixed(2)}</TableCell>
                          <TableCell>₹{parseFloat(earning.commission).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={earning.status === "paid" ? "default" : "secondary"}>
                              {earning.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(earning.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Platform Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your platform settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="platform-name">Platform Name</Label>
                      <Input id="platform-name" value="Growsence" />
                    </div>
                    <div>
                      <Label htmlFor="commission-rate">Direct Sales Commission (%)</Label>
                      <Input id="commission-rate" type="number" value="58" />
                    </div>
                    <div>
                      <Label htmlFor="min-withdrawal">Minimum Withdrawal Amount (₹)</Label>
                      <Input id="min-withdrawal" type="number" value="200" />
                    </div>
                    <div>
                      <Label htmlFor="basic-price">Basic Package Price (₹)</Label>
                      <Input id="basic-price" type="number" value="1499" />
                    </div>
                    <div>
                      <Label htmlFor="pro-price">Pro Package Price (₹)</Label>
                      <Input id="pro-price" type="number" value="2999" />
                    </div>
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
