import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, User, Mail, Lock } from 'lucide-react';

type AuthFormValues = {
  name: string;
  email: string;
  password: string;
};

type FirebaseAuthError = {
  code?: string;
};

const signUpSchema = z.object({
  name: z.string().min(3, { message: 'Nome precisa de 3+ caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'Senha precisa de 6+ caracteres' }),
});

const signInSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
});

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (values: AuthFormValues) => {
    const { email, password, name } = values;
    let error;

    if (isSignUp) {
      const result = await signUp(email, password, name);
      error = result.error;
    } else {
      const result = await signIn(email, password);
      error = result.error;
    }

    if (error) {
      console.error("Firebase Error:", error);
      toast.error('Falha na autenticação', {
        description: getFirebaseErrorMessage(error),
      });
    } else {
      toast.success(isSignUp ? 'Conta criada com sucesso!' : 'Bem-vindo de volta!');
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-wider text-foreground">
              TRAFFIC <span className="text-primary">INTELLIGENCE</span>
            </span>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-center text-foreground">
            {isSignUp ? 'Criar conta' : 'Acessar conta'}
          </h2>
          <p className="text-muted-foreground text-center mt-2 mb-6">
            {isSignUp ? 'Comece a auditar suas campanhas' : 'Bem-vindo de volta'}
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Nome completo" {...form.register('name')} className="pl-9" />
                {form.formState.errors.name && <p className='text-xs text-destructive mt-1'>{String(form.formState.errors.name.message)}</p>}
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="E-mail" {...form.register('email')} className="pl-9" />
              {form.formState.errors.email && <p className='text-xs text-destructive mt-1'>{String(form.formState.errors.email.message)}</p>}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="password" placeholder="Senha" {...form.register('password')} className="pl-9" />
              {form.formState.errors.password && <p className='text-xs text-destructive mt-1'>{String(form.formState.errors.password.message)}</p>}
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={form.formState.isSubmitting}>
              {isSignUp ? 'Criar minha conta' : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-semibold hover:underline">
              {isSignUp ? 'Faça login' : 'Crie uma conta'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function getFirebaseErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const { code } = error as FirebaseAuthError;

    switch (code) {
      case 'auth/invalid-email':
        return 'O formato do e-mail é inválido.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está sendo usado por outra conta.';
      case 'auth/weak-password':
        return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'E-mail ou senha incorretos.';
      case 'auth/configuration-not-found':
      case 'auth/invalid-api-key':
        return 'Erro de configuração do Firebase. Verifique as chaves no .env e reinicie o servidor.';
      default:
        return 'Ocorreu um erro inesperado. Tente novamente.';
    }
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
}
