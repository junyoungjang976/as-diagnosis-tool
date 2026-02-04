'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Link2, Download, Copy, Check, Loader2 } from 'lucide-react';

interface SendDialogProps {
  estimateId: string;
  trigger?: React.ReactNode;
}

export function SendDialog({ estimateId, trigger }: SendDialogProps) {
  const [open, setOpen] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      setEmailError('이메일 주소를 입력해주세요.');
      return;
    }

    setEmailLoading(true);
    setEmailError(null);
    setEmailSuccess(false);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estimateId,
          recipientEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '이메일 전송에 실패했습니다.');
      }

      setEmailSuccess(true);
      setRecipientEmail('');
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : '이메일 전송 중 오류가 발생했습니다.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    if (shareUrl) return; // Already generated

    setLinkLoading(true);

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estimateId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '공유 링크 생성에 실패했습니다.');
      }

      setShareUrl(data.shareLink.url);
    } catch (error) {
      console.error('링크 생성 실패:', error);
    } finally {
      setLinkLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const handleDownloadPDF = () => {
    window.open(`/api/estimate/${estimateId}/pdf`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Mail className="w-4 h-4 mr-2" />
            견적서 전송
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>견적서 전송</DialogTitle>
          <DialogDescription>
            이메일, 링크 공유 또는 PDF 다운로드를 선택하세요.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-2" />
              이메일
            </TabsTrigger>
            <TabsTrigger value="link">
              <Link2 className="w-4 h-4 mr-2" />
              링크공유
            </TabsTrigger>
            <TabsTrigger value="download">
              <Download className="w-4 h-4 mr-2" />
              다운로드
            </TabsTrigger>
          </TabsList>

          {/* Email Tab */}
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">수신자 이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                disabled={emailLoading}
              />
            </div>

            {emailError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {emailError}
              </div>
            )}

            {emailSuccess && (
              <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                견적서가 성공적으로 전송되었습니다.
              </div>
            )}

            <Button
              onClick={handleSendEmail}
              disabled={emailLoading || !recipientEmail}
              className="w-full"
            >
              {emailLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  전송 중...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  이메일 전송
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500">
              견적서 PDF가 첨부되어 전송됩니다.
            </p>
          </TabsContent>

          {/* Link Tab */}
          <TabsContent value="link" className="space-y-4">
            {!shareUrl ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  고객이 웹에서 직접 확인할 수 있는 공유 링크를 생성합니다.
                  링크는 30일간 유효합니다.
                </p>
                <Button
                  onClick={handleGenerateLink}
                  disabled={linkLoading}
                  className="w-full"
                >
                  {linkLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 mr-2" />
                      공유 링크 생성
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>공유 링크</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      size="icon"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {copied && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    링크가 클립보드에 복사되었습니다.
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  이 링크는 30일간 유효하며, 고객이 견적서를 확인하고 PDF를 다운로드할 수 있습니다.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Download Tab */}
          <TabsContent value="download" className="space-y-4">
            <p className="text-sm text-gray-600">
              견적서를 PDF 파일로 다운로드합니다.
            </p>
            <Button onClick={handleDownloadPDF} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              PDF 다운로드
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
