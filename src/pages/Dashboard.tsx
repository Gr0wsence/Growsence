import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Award, 
  Heart,
  Target,
  Download,
  Play,
  Share2,
  Copy,
  Wallet,
  Calendar,
  Clock,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
import type { Course, CourseProgress, AffiliateEarning, Withdrawal, CareSenseData } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<string>("default");
  const [currentStreak, setCurrentStreak] = useState(7);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  // Fetch user's enrollment
  const { data: enrollment } = useQuery({
    queryKey: ["/api/enrollments/user", user?.id],
    enabled: !!user?.id,
  });

  // Fetch courses based on user's package
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses", { package: user?.package }],
    enabled: !!user?.package,
  });

  // Fetch course progress
  const { data: progress = [] } = useQuery<CourseProgress[]>({
    queryKey: ["/api/progress/user", user?.id],
    enabled: !!user?.id,
  });

  // Fetch affiliate earnings
  const { data: earnings = [] } = useQuery<AffiliateEarning[]>({
    queryKey: ["/api/affiliate/earnings", user?.id],
    enabled: !!user?.id,
  });

  // Fetch withdrawals
  const { data: withdrawals = [] } = useQuery<Withdrawal[]>({
    queryKey: ["/api/withdrawals/user", user?.id],
    enabled: !!user?.id,
  });

  // Fetch CareSense data
  const { data: careSenseData = [] } = useQuery<CareSenseData[]>({
    queryKey: ["/api/caresense/user", user?.id],
    enabled: !!user?.id,
  });

  // Update course progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { userId: number; courseId: number; progress: number }) => {
      return apiRequest("POST", "/api/progress", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress/user", user?.id] });
      toast({
        title: "Progress updated",
        description: "Your course progress has been saved."
      });
    }
  });

  // Save CareSense data mutation
  const saveCareSenseMutation = useMutation({
    mutationFn: async (data: { userId: number; mood: string; activities?: any; goals?: any }) => {
      return apiRequest("POST", "/api/caresense", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/caresense/user", user?.id] });
      toast({
        title: "Mood saved",
        description: "Your emotional state has been recorded."
      });
    }
  });

  // Request withdrawal mutation
  const requestWithdrawalMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("POST", "/api/withdrawals", { userId: user?.id, amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/withdrawals/user", user?.id] });
      toast({
        title: "Withdrawal requested",
        description: "Your withdrawal request has been submitted."
      });
    },
    onError: (error) => {
      toast({
        title: "Withdrawal failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (!user) {
    return null;
  }

  // Calculate stats
  const completedCourses = progress.filter(p => p.completed).length;
  const totalEarnings = parseFloat(user.totalEarnings || "0");
  const pendingWithdrawals = withdrawals.filter(w => w.status === "pending").length;
  const overallProgress = courses.length > 0 ? (completedCourses / courses.length) * 100 : 0;

  // Generate referral link
  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard."
    });
  };

  const handleMoodUpdate = (mood: string) => {
    setSelectedMood(mood);
    if (user?.id) {
      saveCareSenseMutation.mutate({
        userId: user.id,
        mood,
        activities: [],
        goals: []
      });
    }
  };

  const handleCourseProgress = (courseId: number, newProgress: number) => {
    if (user?.id) {
      updateProgressMutation.mutate({
        userId: user.id,
        courseId,
        progress: newProgress
      });
    }
  };

  const handleWithdrawal = () => {
    if (totalEarnings >= 200) {
      requestWithdrawalMutation.mutate(totalEarnings);
    } else {
      toast({
        title: "Minimum withdrawal amount",
        description: "You need at least ₹200 to withdraw.",
        variant: "destructive"
      });
    }
  };

  const moods = [
    { id: "happy", label: "Happy", emoji: "😊", color: "bg-yellow-500" },
    { id: "calm", label: "Calm", emoji: "😌", color: "bg-blue-500" },
    { id: "focused", label: "Focused", emoji: "🎯", color: "bg-green-500" },
    { id: "stressed", label: "Stressed", emoji: "😰", color: "bg-red-500" },
  ];

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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user.name}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {user.package ? `${user.package.charAt(0).toUpperCase() + user.package.slice(1)} Package` : "No package selected"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">₹{totalEarnings.toFixed(2)}</div>
                <div className="text-sm text-gray-500">Total Earnings</div>
              </div>
            </div>
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
                      <p className="text-blue-100">Courses Completed</p>
                      <p className="text-3xl font-bold">{completedCourses}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-100" />
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
                      <p className="text-green-100">Total Earnings</p>
                      <p className="text-3xl font-bold">₹{totalEarnings.toFixed(0)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-100" />
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
                      <p className="text-orange-100">Referrals</p>
                      <p className="text-3xl font-bold">{earnings.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-100" />
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
                      <p className="text-purple-100">Learning Streak</p>
                      <p className="text-3xl font-bold">{currentStreak}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-100" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
              <TabsTrigger value="caresense">CareSense</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Available Courses
                      </CardTitle>
                      <CardDescription>
                        Continue your learning journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {courses.map((course) => {
                          const courseProgress = progress.find(p => p.courseId === course.id);
                          const progressValue = courseProgress?.progress || 0;
                          const isCompleted = courseProgress?.completed || false;
                          
                          return (
                            <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {course.title}
                                </h3>
                                {isCompleted && (
                                  <Badge className="bg-green-500 text-white">
                                    <Award className="h-3 w-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                {course.description}
                              </p>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  {course.duration} minutes
                                </div>
                                <div className="text-sm text-gray-500">
                                  {progressValue}% complete
                                </div>
                              </div>
                              <Progress value={progressValue} className="mb-3" />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="flex items-center gap-2"
                                  onClick={() => {
                                    // Simulate course progress update
                                    const newProgress = Math.min(progressValue + 25, 100);
                                    handleCourseProgress(course.id, newProgress);
                                  }}
                                >
                                  <Play className="h-4 w-4" />
                                  {progressValue > 0 ? "Continue" : "Start"}
                                </Button>
                                {course.pdfUrl && (
                                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Download
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {overallProgress.toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-500">Overall Progress</div>
                      </div>
                      <Progress value={overallProgress} className="mb-4" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Completed:</span>
                          <span>{completedCourses}/{courses.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next goal:</span>
                          <span>Complete all courses</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Award className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">First Course</div>
                            <div className="text-sm text-gray-500">Complete your first course</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">First Referral</div>
                            <div className="text-sm text-gray-500">Get your first referral</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Affiliate Tab */}
            <TabsContent value="affiliate" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="h-5 w-5" />
                      Referral Link
                    </CardTitle>
                    <CardDescription>
                      Share your unique referral link to earn commissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono">
                        {referralLink}
                      </div>
                      <Button onClick={copyReferralLink} size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                      <p>Your referral code: <strong>{user.referralCode}</strong></p>
                      <p className="mt-2">Commission rates:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Direct sales: 58%</li>
                        <li>Team sales (Basic): 12%</li>
                        <li>Team sales (Pro): 17%</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Affiliate Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{earnings.length}</div>
                        <div className="text-sm text-gray-500">Total Referrals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">₹{totalEarnings.toFixed(0)}</div>
                        <div className="text-sm text-gray-500">Total Earnings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {earnings.filter(e => e.type === 'direct').length}
                        </div>
                        <div className="text-sm text-gray-500">Direct Sales</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {earnings.filter(e => e.type === 'team').length}
                        </div>
                        <div className="text-sm text-gray-500">Team Sales</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {earnings.length > 0 ? (
                      earnings.slice(0, 5).map((earning) => (
                        <div key={earning.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">
                              {earning.type === 'direct' ? 'Direct Sale' : 'Team Sale'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(earning.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">
                              +₹{parseFloat(earning.commission).toFixed(2)}
                            </div>
                            <Badge variant={earning.status === 'paid' ? 'default' : 'secondary'}>
                              {earning.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No earnings yet. Start sharing your referral link!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CareSense Tab */}
            <TabsContent value="caresense" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      How are you feeling today?
                    </CardTitle>
                    <CardDescription>
                      Track your mood to personalize your learning experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {moods.map((mood) => (
                        <Button
                          key={mood.id}
                          variant={selectedMood === mood.id ? "default" : "outline"}
                          className="h-20 flex-col"
                          onClick={() => handleMoodUpdate(mood.id)}
                        >
                          <span className="text-2xl mb-1">{mood.emoji}</span>
                          <span>{mood.label}</span>
                        </Button>
                      ))}
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Emotional Balance</span>
                        <span className="text-sm text-gray-500">
                          {selectedMood === 'happy' ? '90%' : selectedMood === 'calm' ? '85%' : selectedMood === 'focused' ? '80%' : '45%'}
                        </span>
                      </div>
                      <Progress 
                        value={selectedMood === 'happy' ? 90 : selectedMood === 'calm' ? 85 : selectedMood === 'focused' ? 80 : 45} 
                        className="mb-2"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Your learning environment will adapt to your mood
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Daily Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span>Study for 30 minutes</span>
                        </div>
                        <Badge variant="default">Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <span>Complete 1 course module</span>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                          <span>Take a mood check</span>
                        </div>
                        <Badge variant="default">Complete</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Wellness Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">7</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Day Streak</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Avg. Mood Score</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Goals Achieved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ₹{totalEarnings.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">Available for withdrawal</div>
                      <Button 
                        onClick={handleWithdrawal}
                        disabled={totalEarnings < 200 || requestWithdrawalMutation.isPending}
                        className="w-full"
                      >
                        {requestWithdrawalMutation.isPending ? "Processing..." : "Request Withdrawal"}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Minimum withdrawal: ₹200
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Withdrawal History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {withdrawals.length > 0 ? (
                        withdrawals.slice(0, 5).map((withdrawal) => (
                          <div key={withdrawal.id} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">₹{parseFloat(withdrawal.amount).toFixed(2)}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(withdrawal.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge variant={
                              withdrawal.status === 'completed' ? 'default' :
                              withdrawal.status === 'processing' ? 'secondary' : 'outline'
                            }>
                              {withdrawal.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No withdrawals yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Earning Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>This month:</span>
                        <span className="font-bold">₹{totalEarnings.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-bold">₹0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Withdrawn:</span>
                        <span className="font-bold">₹0.00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>₹{totalEarnings.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {user.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {user.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {user.phone || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Package</label>
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {user.package ? `${user.package.charAt(0).toUpperCase() + user.package.slice(1)} Package` : "No package"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Referral Code</label>
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono">
                        {user.referralCode}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Member Since</label>
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
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
