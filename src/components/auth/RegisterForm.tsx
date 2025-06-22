'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, UserPlus, Mail, Lock, Eye, EyeOff, User, Building, Bike, Phone, MapPin } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLocal: boolean;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  contactPerson?: string;
  phone?: string;
  vehicleType?: 'moto' | 'bici';
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const form = useForm<RegisterFormInputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isLocal: false,
      businessName: '',
      businessAddress: '',
      businessPhone: '',
      contactPerson: '',
      phone: '',
      vehicleType: 'moto'
    }
  });

  const isLocal = form.watch('isLocal');

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      setIsLoading(true);
      
      // Preparar datos adicionales según el tipo
      const additionalData = data.isLocal ? {
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        businessPhone: data.businessPhone,
        contactPerson: data.contactPerson || data.name
      } : {
        phone: data.phone,
        vehicleType: data.vehicleType
      };

      const role = data.isLocal ? 'local' : 'rider';
      
      await registerUser(data.name, data.email, data.password, role, additionalData);
      router.push('/dashboard');
    } catch (error: any) {
      // Manejar errores específicos de Firebase
      if (error.code === 'auth/email-already-in-use') {
        form.setError('email', {
          type: 'manual',
          message: 'Este correo electrónico ya está registrado'
        });
      } else {
        form.setError('root', {
          type: 'manual',
          message: 'Error al crear la cuenta. Por favor, intenta nuevamente.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-white">
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}

        {/* Selector de tipo de usuario */}
        <div className="space-y-3 p-4 rounded-lg bg-[#1a1a1a] border border-[#333333]">
          <Label className="text-sm font-medium text-white/90">Tipo de cuenta</Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bike className={`h-4 w-4 ${!isLocal ? 'text-[#ffd700]' : 'text-white/50'}`} />
              <span className={`text-sm ${!isLocal ? 'font-medium text-[#ffd700]' : 'text-white/50'}`}>
                Repartidor
              </span>
            </div>
            <FormField
              control={form.control}
              name="isLocal"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-[#ffd700]"
                />
              )}
            />
            <div className="flex items-center space-x-2">
              <Building className={`h-4 w-4 ${isLocal ? 'text-[#ffd700]' : 'text-white/50'}`} />
              <span className={`text-sm ${isLocal ? 'font-medium text-[#ffd700]' : 'text-white/50'}`}>
                Local/Negocio
              </span>
            </div>
          </div>
        </div>

        {/* Campos básicos */}
        <FormField
          control={form.control}
          name="name"
          rules={{ required: 'El nombre es requerido' }}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="name" className="sr-only">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <FormControl>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="Nombre completo"
                    className={`bg-[#1a1a1a] pl-9 h-9 text-sm text-white border-[#333333] focus:border-[#ffd700] focus:ring-[#ffd700]/20 ${
                      form.formState.errors.name ? 'border-red-500' : ''
                    }`}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'El email es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="email" className="sr-only">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <FormControl>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className={`bg-[#1a1a1a] pl-9 h-9 text-sm text-white border-[#333333] focus:border-[#ffd700] focus:ring-[#ffd700]/20 ${
                      form.formState.errors.email ? 'border-red-500' : ''
                    }`}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          rules={{
            required: 'La contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="password" className="sr-only">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <FormControl>
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    className={`bg-[#1a1a1a] pl-9 pr-9 h-9 text-sm text-white border-[#333333] focus:border-[#ffd700] focus:ring-[#ffd700]/20 ${
                      form.formState.errors.password ? 'border-red-500' : ''
                    }`}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          rules={{
            required: 'Confirma tu contraseña',
            validate: (value) => value === form.getValues('password') || 'Las contraseñas no coinciden'
          }}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="confirmPassword" className="sr-only">Repetir Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <FormControl>
                  <Input
                    {...field}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    className={`bg-[#1a1a1a] pl-9 pr-9 h-9 text-sm text-white border-[#333333] focus:border-[#ffd700] focus:ring-[#ffd700]/20 ${
                      form.formState.errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="bg-[#333333]" />

        {/* Campos específicos según el tipo */}
        {isLocal ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#ffd700] flex items-center gap-2">
              <Building className="h-4 w-4" />
              Información del Negocio
            </h3>
            
            <FormField
              control={form.control}
              name="businessName"
              rules={{ required: isLocal ? 'El nombre del negocio es requerido' : false }}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="businessName" className="sr-only">Nombre del negocio</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <FormControl>
                      <Input
                        {...field}
                        id="businessName"
                        type="text"
                        placeholder="Nombre del negocio"
                        className={`bg-[#1a1a1a] pl-9 h-9 text-sm text-white border-[#333333] focus:border-[#ffd700] focus:ring-[#ffd700]/20 ${
                          form.formState.errors.businessName ? 'border-red-500' : ''
                        }`}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessAddress"
              rules={{ required: isLocal ? 'La dirección del negocio es requerida' : false }}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="businessAddress" className="sr-only">Dirección del negocio</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <FormControl>
                      <Input
                        {...field}
                        id="businessAddress"
                        type="text"
                        placeholder="Dirección del negocio"
                        className={`bg-[#1a1a1a] pl-9 h-9 text-sm text-white border-[#333333] focus:border-[#ffd700] focus:ring-[#ffd700]/20 ${
                          form.formState.errors.businessAddress ? 'border-red-500' : ''
                        }`}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessPhone"
              rules={{
                required: 'El teléfono del negocio es requerido',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Solo se permiten números'
                },
                minLength: {
                  value: 8,
                  message: 'El número debe tener al menos 8 dígitos'
                },
                maxLength: {
                  value: 15,
                  message: 'El número no puede tener más de 15 dígitos'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="businessPhone" className="sr-only">Teléfono del negocio</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <FormControl>
                      <Input
                        {...field}
                        id="businessPhone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Teléfono del negocio"
                        value={field.value || ''}
                        className={`bg-[#1a1a1a] pl-9 h-9 text-sm text-white border-[#333333] focus:border-[#ffd700] focus:ring-[#ffd700]/20 ${
                          form.formState.errors.businessPhone ? 'border-red-500' : ''
                        }`}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="contactPerson" className="sr-only">Persona de contacto (opcional)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <FormControl>
                      <Input
                        {...field}
                        id="contactPerson"
                        type="text"
                        placeholder="Persona de contacto (opcional)"
                        className="bg-[#1a1a1a] pl-9 h-9 text-sm text-white border-[#333333] focus:border-[#ffd700] focus:ring-[#ffd700]/20"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#ffd700] flex items-center gap-2">
              <Bike className="h-4 w-4" />
              Información del Repartidor
            </h3>
            
            <FormField
              control={form.control}
              name="phone"
              rules={{
                required: 'El teléfono es requerido',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Solo se permiten números'
                },
                minLength: {
                  value: 8,
                  message: 'El número debe tener al menos 8 dígitos'
                },
                maxLength: {
                  value: 15,
                  message: 'El número no puede tener más de 15 dígitos'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="phone" className="sr-only">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <FormControl>
                      <Input
                        {...field}
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Teléfono"
                        value={field.value || ''}
                        className={`bg-[#1a1a1a] pl-9 h-9 text-sm text-white border-[#333333] focus:border-[#ffd700] focus:ring-[#ffd700]/20 ${
                          form.formState.errors.phone ? 'border-red-500' : ''
                        }`}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm text-white/90">Tipo de vehículo</Label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => field.onChange('moto')}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors ${
                        field.value === 'moto'
                          ? 'bg-[#ffd700] text-black'
                          : 'bg-[#1a1a1a] text-white/70 hover:text-white'
                      }`}
                    >
                      <Bike className="h-4 w-4" />
                      <span className="text-sm">Moto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange('bici')}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors ${
                        field.value === 'bici'
                          ? 'bg-[#ffd700] text-black'
                          : 'bg-[#1a1a1a] text-white/70 hover:text-white'
                      }`}
                    >
                      <Bike className="h-4 w-4" />
                      <span className="text-sm">Bicicleta</span>
                    </button>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="pt-3">
          <Button 
            type="submit" 
            size="sm" 
            className="w-full bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-medium" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin mr-2">⏳</span>
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Crear Cuenta
          </Button>
        </div>
      </form>
    </Form>
  );
}
