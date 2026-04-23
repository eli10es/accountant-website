import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ArrowUp,
  Award,
  BookOpen,
  Calculator,
  ChevronRight,
  Clock,
  Facebook,
  Linkedin,
  LucideAngularModule,
  Mail,
  MapPin,
  Menu,
  Phone,
  Send,
  Shield,
  TrendingUp,
  Twitter,
  Users,
  X,
} from 'lucide-angular';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private http = inject(HttpClient);

  // Lucide icons
  readonly icons = {
    Phone,
    Mail,
    MapPin,
    Menu,
    X,
    ChevronRight,
    Calculator,
    BookOpen,
    Users,
    TrendingUp,
    Shield,
    Clock,
    Award,
    Send,
    Facebook,
    Twitter,
    Linkedin,
    ArrowUp,
  };

  // --- UI State Signals ---
  mobileMenuOpen = signal(false);
  scrolled = signal(false);

  // --- Contact Form Signals ---
  formData = signal<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  formSubmitting = signal(false);
  formSuccess = signal(false);
  formError = signal('');
  toastVisible = signal(false);

  // --- Validation Signals ---
  touched = signal<Record<string, boolean>>({});

  nameValid = computed(() => this.formData().name.trim().length >= 2);
  emailValid = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData().email),
  );
  phoneValid = computed(
    () =>
      this.formData().phone === '' ||
      /^[\d\s\-+()]{7,}$/.test(this.formData().phone),
  );
  messageValid = computed(() => this.formData().message.trim().length >= 10);
  formValid = computed(
    () =>
      this.nameValid() &&
      this.emailValid() &&
      this.messageValid() &&
      this.phoneValid(),
  );

  // --- Navigation ---
  navLinks = [
    { label: 'Servicii', href: '#services' },
    { label: 'Despre Mine', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  // --- Services Data ---
  services = [
    {
      icon: Calculator,
      title: 'Declarații Fiscale',
      description:
        'Întocmesc și depun declarațiile tale fiscale cu precizie, ca să plătești doar ce trebuie și la timp.',
    },
    {
      icon: BookOpen,
      title: 'Contabilitate Primară',
      description:
        'Țin evidența contabilă la zi, astfel încât să știi mereu unde stă afacerea ta financiar.',
    },
    {
      icon: Users,
      title: 'Salarizare',
      description:
        'Mă ocup de întreaga salarizare a echipei tale — calcul, conformitate și depunere la timp.',
    },
    {
      icon: TrendingUp,
      title: 'Consultanță Financiară',
      description:
        'Te consiliez pe baza cifrelor reale — flux de numerar, optimizări fiscale și decizii de creștere.',
    },
  ];

  // --- About Stats ---
  stats = [
    { icon: Shield, value: '15+', label: 'Ani de Experiență' },
    { icon: Users, value: '500+', label: 'Clienți Mulțumiți' },
    { icon: Clock, value: 'Non-stop', label: 'Suport Disponibil' },
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolled.set(window.scrollY > 20);
      });
    }
  }

  toggleMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.mobileMenuOpen.set(false);
  }

  updateField(field: keyof ContactForm, value: string) {
    this.formData.update((f) => ({ ...f, [field]: value }));
  }

  markTouched(field: string) {
    this.touched.update((t) => ({ ...t, [field]: true }));
  }

  isTouched(field: string): boolean {
    return !!this.touched()[field];
  }

  submitForm() {
    if (!this.formValid() || this.formSubmitting()) return;

    this.formSubmitting.set(true);
    this.formError.set('');

    // Mock API call (replace URL with Formspree endpoint or your backend)
    this.http
      .post('https://formspree.io/f/your-form-id', this.formData())
      .subscribe({
        next: () => {
          this.formSubmitting.set(false);
          this.formSuccess.set(true);
          this.toastVisible.set(true);
          this.formData.set({ name: '', email: '', phone: '', message: '' });
          this.touched.set({});
          setTimeout(() => this.toastVisible.set(false), 4000);
        },
        error: () => {
          // Treat as success for demo (mock endpoint)
          this.formSubmitting.set(false);
          this.formSuccess.set(true);
          this.toastVisible.set(true);
          this.formData.set({ name: '', email: '', phone: '', message: '' });
          this.touched.set({});
          setTimeout(() => this.toastVisible.set(false), 4000);
        },
      });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
