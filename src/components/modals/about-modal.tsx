"use client";

import Image from "next/image";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, ShieldCheck, User } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] p-4 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="relative size-10 flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="Pingly Logo"
                width={40}
                height={40}
                className="object-contain w-auto h-8.5 dark:brightness-110"
              />
            </div>
            <div>
              <DialogTitle className="text-lg">{t("about_dev_title")}</DialogTitle>
              <DialogDescription>
                {t("about_dev_subtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-1 text-xs text-muted-foreground leading-relaxed">
          {/* Profile Card */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400">
                <User className="size-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  Muhammad Adam Hidayat (AdamByte)
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Fullstack Developer & Network Enthusiast
                </p>
              </div>
            </div>
            <p className="text-[11px] text-foreground/80 leading-normal">
              Siswa Teknik Jaringan Komputer dan Telekomunikasi (TJKT) di SMK Negeri 1 Majalengka.
            </p>
            <blockquote className="text-[11px] italic text-muted-foreground border-l-2 border-[#800020] pl-2.5 my-2">
              &quot;Membangun sistem yang handal bukan hanya tentang baris kode yang ditulis, melainkan tentang bagaimana setiap subsistem bekerja selaras untuk memecahkan masalah nyata secara aman, transparan, dan terukur.&quot;
            </blockquote>

            <div className="pt-2 border-t border-border/50 flex flex-col gap-1.5 text-[11px]">
              <a
                href="https://github.com/adambyte-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground hover:text-[#800020] transition-colors"
              >
                <svg className="size-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub: @adambyte-dev</span>
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Instagram: @adambyte.dev</span>
              </div>
              <a
                href="mailto:mail.adamhidayat@gmail.com"
                className="flex items-center gap-2 text-foreground hover:text-[#800020] transition-colors"
              >
                <Mail className="size-3.5" />
                <span>Email: mail.adamhidayat@gmail.com</span>
              </a>
            </div>
          </div>

          {/* License & Disclaimer */}
          <div className="p-3.5 rounded-xl bg-muted/20 border border-border/40 space-y-1.5 text-[11px]">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#800020] dark:text-rose-400" />
              <span>📄 Lisensi, Hak Cipta, & Disclaimer</span>
            </div>
            <p>
              Proyek ini dilisensikan di bawah <strong>MIT License</strong>.
            </p>
            <p className="font-medium text-foreground">
              Hak Cipta Desain Sistem & Spesifikasi © 2026 Tim Pengembang Sistem Informasi Sekolah — SMKN 1 Majalengka.
            </p>
            <p className="text-muted-foreground/80 italic text-[10px]">
              Disclaimer: Sistem ini dibangun untuk mendukung transparansi dan efisiensi manajemen sarana prasarana sekolah secara digital. Segala bentuk implementasi pada skala produksi wajib mengikuti regulasi pengadaan barang dan jasa instansi terkait.
            </p>
          </div>

          {/* Ad Slot */}
          <AdSlot
            variant="compact"
            slotId="modal-about-ad"
            className="pt-1"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
