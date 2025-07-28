"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Shield, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useToast } from "@/shadcn/ui/use-toast";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shadcn/ui/alert-dialog";
import { executeAdminOperation } from "rhythia-api";
import { getJwt, useProfile } from "@/supabase";
import {
  AdminOperationConfig,
  AdminOperationWrapper,
} from "./DynamicAdminConfig";

const changeBadgesConfig: AdminOperationConfig = {
  operation: "changeBadges",
  title: "Change User Badges",
  description:
    'This will update the user\'s badges. Enter the badges as a valid JSON array (e.g., ["Global Moderator", "Verified"]).',
  inputs: [
    {
      name: "badges",
      label: "Badges (JSON Array)",
      placeholder: '["Global Moderator", "Verified"]',
      required: true,
    },
  ],
  confirmationText: "i confirm",
  successMessage: "User badges have been updated successfully",
  buttonText: "Change Badges",
};

export function AdminControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayerRoute, setIsPlayerRoute] = useState(false);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toast } = useToast();
  const pathname = usePathname();
  const me = useProfile();

  // Check if we're on a player page
  useEffect(() => {
    const match = pathname?.match(/\/player\/(\d+)/);
    if (match) {
      setIsPlayerRoute(true);
      setPlayerId(parseInt(match[1]));
    } else {
      setIsPlayerRoute(false);
      setPlayerId(null);
    }
  }, [pathname]);

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setIsLoading(true);
    try {
      const result = await executeAdminOperation({
        data: { operation: "searchUsers", params: { searchText } },
        session: await getJwt(),
      });
      if (result?.success && result?.result) {
        setSearchResults(result.result);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };

  if (!me.userProfile?.badges?.includes("Global Moderator")) return <></>;

  return (
    <Dialog open={!!isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full h-12 w-12 bg-red-600 hover:bg-red-700 border-red-700 text-white z-[100]"
        >
          <Shield className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Controls</DialogTitle>
          <DialogDescription>Global Moderator actions panel</DialogDescription>
        </DialogHeader>

        {isPlayerRoute && playerId ? (
          <PlayerAdminControls playerId={playerId} isLoading={isLoading} />
        ) : (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Search for users..."
                value={searchText}
                onChange={(e: any) => setSearchText(e.target.value)}
                onKeyDown={(e: any) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                Search
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Search Results</h3>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="p-2 hover:bg-neutral-800 cursor-pointer flex justify-between items-center"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div>
                        <p className="font-medium">
                          {user.username || "Unnamed"}
                        </p>
                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedUser && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedUser.username || "Unnamed User"}
                  </CardTitle>
                  <CardDescription>ID: {selectedUser.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <PlayerAdminControls
                    playerId={selectedUser.id}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface PlayerAdminControlsProps {
  playerId: number;
  isLoading: boolean;
}

function PlayerAdminControls({
  playerId,
  isLoading,
}: PlayerAdminControlsProps) {
  return (
    <Tabs defaultValue="actions">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="actions">User Actions</TabsTrigger>
        <TabsTrigger value="scores">Score Actions</TabsTrigger>
      </TabsList>

      <TabsContent value="actions" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-2">
          <ConfirmationDialogWrapper
            title="Silence User"
            description="This will prevent the user from chatting but allows them to play."
            confirmText="Silence"
            onConfirm={async () =>
              executeAdminOperation({
                data: {
                  operation: "silenceUser",
                  params: { userId: playerId },
                },
                session: await getJwt(),
              })
            }
            disabled={isLoading}
          >
            <Button variant="outline" className="w-full">
              Silence User
            </Button>
          </ConfirmationDialogWrapper>

          <ConfirmationDialogWrapper
            title="Restrict User"
            description="This will restrict the user from submitting scores."
            confirmText="Restrict"
            onConfirm={async () =>
              executeAdminOperation({
                data: {
                  operation: "restrictUser",
                  params: { userId: playerId },
                },
                session: await getJwt(),
              })
            }
            disabled={isLoading}
          >
            <Button variant="outline" className="w-full">
              Restrict User
            </Button>
          </ConfirmationDialogWrapper>

          <ConfirmationDialogWrapper
            title="Exclude User"
            description="This will exclude the user from all rankings."
            confirmText="Exclude"
            onConfirm={async () =>
              executeAdminOperation({
                data: {
                  operation: "excludeUser",
                  params: { userId: playerId },
                },
                session: await getJwt(),
              })
            }
            disabled={isLoading}
          >
            <Button variant="outline" className="w-full">
              Exclude User
            </Button>
          </ConfirmationDialogWrapper>

          <ConfirmationDialogWrapper
            title="Remove Ban"
            description="This will unban the user completely."
            confirmText="Unban"
            onConfirm={async () =>
              executeAdminOperation({
                data: {
                  operation: "unbanUser",
                  params: { userId: playerId },
                },
                session: await getJwt(),
              })
            }
            disabled={isLoading}
          >
            <Button variant="outline" className="w-full">
              Unban User
            </Button>
          </ConfirmationDialogWrapper>

          <FlagChangeWrapper playerId={playerId} isLoading={isLoading}>
            <Button variant="outline" className="w-full">
              Flag Change
            </Button>
          </FlagChangeWrapper>

          <AdminOperationWrapper
            playerId={playerId}
            isLoading={isLoading}
            config={changeBadgesConfig}
          >
            <Button variant="outline">Change Badges</Button>
          </AdminOperationWrapper>

          <ConfirmationDialogWrapper
            title="Profanity Clear"
            description="This will clear user's about me and generate a new username"
            confirmText="Delete"
            confirmVariant="destructive"
            onConfirm={async () =>
              executeAdminOperation({
                data: {
                  operation: "profanityClear",
                  params: { userId: playerId },
                },
                session: await getJwt(),
              })
            }
            disabled={isLoading}
          >
            <Button variant="outline" className="w-full ">
              Profanity Clear
            </Button>
          </ConfirmationDialogWrapper>
          <ConfirmationDialogWrapper
            title="Delete User"
            description="This will permanently delete the user and all related data. This action cannot be undone."
            confirmText="Delete"
            confirmVariant="destructive"
            onConfirm={async () =>
              executeAdminOperation({
                data: {
                  operation: "deleteUser",
                  params: { userId: playerId },
                },
                session: await getJwt(),
              })
            }
            disabled={isLoading}
          >
            <Button variant="destructive" className="w-full col-span-2">
              Delete User
            </Button>
          </ConfirmationDialogWrapper>
        </div>
      </TabsContent>

      <TabsContent value="scores" className="space-y-4 mt-4">
        <UserScoresDisplay playerId={playerId} />

        <div className="grid grid-cols-1 gap-2 mt-4">
          <ConfirmationDialogWrapper
            title="Invalidate Ranked Scores"
            description="This will set all ranked scores to 0 RP but keep the scores in the database."
            confirmText="Invalidate"
            onConfirm={async () =>
              executeAdminOperation({
                data: {
                  operation: "invalidateRankedScores",
                  params: { userId: playerId },
                },
                session: await getJwt(),
              })
            }
            disabled={isLoading}
          >
            <Button variant="outline" className="w-full">
              Invalidate Ranked Scores
            </Button>
          </ConfirmationDialogWrapper>

          <ConfirmationDialogWrapper
            title="Remove All Scores"
            description="This will permanently delete all scores for this user. This action cannot be undone."
            confirmText="Remove"
            confirmVariant="destructive"
            onConfirm={async () =>
              executeAdminOperation({
                data: {
                  operation: "removeAllScores",
                  params: { userId: playerId },
                },
                session: await getJwt(),
              })
            }
            disabled={isLoading}
          >
            <Button variant="destructive" className="w-full">
              Remove All Scores
            </Button>
          </ConfirmationDialogWrapper>
        </div>
      </TabsContent>
    </Tabs>
  );
}

interface FlagChangeWrapperProps {
  playerId: number;
  isLoading: boolean;
  children: React.ReactNode;
}

function FlagChangeWrapper({
  playerId,
  isLoading,
  children,
}: FlagChangeWrapperProps) {
  const [open, setOpen] = useState(false);
  const [flagValue, setFlagValue] = useState("");
  const [confirmInput, setConfirmInput] = useState("");
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (confirmInput.toLowerCase() !== "i confirm") {
      toast({
        title: "Confirmation failed",
        description: 'You must type "i confirm" to proceed with this action.',
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await executeAdminOperation({
        data: {
          operation: "changeFlag",
          params: {
            userId: playerId,
            flag: flagValue,
          },
        },
        session: await getJwt(),
      });

      if (result?.success) {
        toast({
          title: "Flag Changed",
          description: `User flag has been updated to "${flagValue}"`,
        });
      } else {
        toast({
          title: "Error",
          description: result?.error || "Failed to change user flag",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }

    setOpen(false);
    setFlagValue("");
    setConfirmInput("");
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setFlagValue("");
          setConfirmInput("");
        }
      }}
    >
      <AlertDialogTrigger asChild disabled={isLoading}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change User Flag</AlertDialogTitle>
          <AlertDialogDescription>
            This will change the user's flag. Enter the new flag value below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2 space-y-4">
          <div>
            <Label htmlFor="flag-input" className="text-sm font-medium">
              New Flag Value:
            </Label>
            <Input
              id="flag-input"
              value={flagValue}
              onChange={(e) => setFlagValue(e.target.value)}
              className="mt-2"
              placeholder="Enter new flag value"
            />
          </div>

          <div>
            <Label htmlFor="confirm-input" className="text-sm font-medium">
              Type "i confirm" to proceed:
            </Label>
            <Input
              id="confirm-input"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="mt-2"
              placeholder="i confirm"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={
              !flagValue.trim() || confirmInput.toLowerCase() !== "i confirm"
            }
          >
            Change Flag
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ConfirmationDialogWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  disabled?: boolean;
  confirmVariant?: "default" | "destructive";
}

function ConfirmationDialogWrapper({
  children,
  title,
  description,
  confirmText,
  onConfirm,
  disabled = false,
  confirmVariant = "default",
}: ConfirmationDialogWrapperProps) {
  const [open, setOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const { toast } = useToast();

  const handleConfirm = () => {
    if (confirmInput.toLowerCase() !== "i confirm") {
      toast({
        title: "Confirmation failed",
        description: 'You must type "i confirm" to proceed with this action.',
        variant: "destructive",
      });
      return;
    }

    onConfirm();
    setOpen(false);
    setConfirmInput("");
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setConfirmInput("");
        }
      }}
    >
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Label htmlFor="confirm-input" className="text-sm font-medium">
            Type "i confirm" to proceed:
          </Label>
          <Input
            id="confirm-input"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            className="mt-2"
            placeholder="i confirm"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              confirmVariant === "destructive"
                ? "bg-red-600 hover:bg-red-700"
                : ""
            }
            disabled={confirmInput.toLowerCase() !== "i confirm"}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface UserScoresDisplayProps {
  playerId: number;
}

function UserScoresDisplay({ playerId }: UserScoresDisplayProps) {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedScore, setSelectedScore] = useState<any>(null);
  const { toast } = useToast();

  const limit = 10;

  const fetchScores = async (page: number) => {
    setLoading(true);
    try {
      const result = await executeAdminOperation({
        data: {
          operation: "getScoresPaginated",
          params: {
            userId: playerId,
            page,
            limit,
            includeAdditionalData: true,
          },
        },
        session: await getJwt(),
      });

      if (result?.success && result?.result) {
        setScores(result.result.scores || []);
        const pagination = result.result.pagination;
        const calculatedTotalPages = pagination?.total && limit ? Math.ceil(pagination.total / limit) : 0;
        setTotalPages(pagination?.totalPages || calculatedTotalPages);
        setTotal(pagination?.total || 0);
        setCurrentPage(page);
        console.log('Pagination data:', pagination, 'Calculated pages:', calculatedTotalPages);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch user scores",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching scores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores(1);
  }, [playerId]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchScores(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (scores.length >= limit) {
      fetchScores(currentPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Scores</CardTitle>
            <CardDescription>
              {total > 0 ? `Total: ${total} scores` : "No scores found"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-sm text-gray-500">Loading scores...</div>
              </div>
            ) : scores.length > 0 ? (
              <div className="space-y-1">
                {scores.map((score) => (
                  <div
                    key={score.id}
                    className="border rounded p-2 bg-neutral-800/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono">#{score.id}</span>
                      <span>SP: {score.awarded_sp || 0}</span>
                      <span>{score.username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedScore(score)}
                      className="h-6 w-6 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <span className="text-sm text-gray-400 min-w-20 text-center">
                    Page {currentPage}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={scores.length < limit || loading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No scores found for this user
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {selectedScore && (
        <div className="w-1/2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Score Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedScore(null)}
                >
                  ×
                </Button>
              </div>
              <CardDescription>
                Score ID: {selectedScore.id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Basic Info</h4>
                  <div className="text-xs space-y-1">
                    <div>SP: {selectedScore.awarded_sp || 0}</div>
                    <div>User: {selectedScore.username} (ID: {selectedScore.userId})</div>
                  </div>
                </div>
                
                {selectedScore.additional_data && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Additional Data</h4>
                    <div className="bg-neutral-900 p-3 rounded text-xs overflow-auto max-h-96">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(selectedScore.additional_data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
