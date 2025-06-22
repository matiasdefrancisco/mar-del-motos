'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, Building, Bike, Users, ShieldCheck, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function CreateUserPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Datos básicos
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'rider' as 'admin' | 'operator' | 'rider' | 'local',
    
    // Datos específicos para Local
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    contactPerson: '',
    
    // Datos específicos para Rider
    phone: '',
    vehicleType: 'moto' as 'moto' | 'bici',
    
    // Estado
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Validaciones
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('Todos los campos obligatorios deben estar completos');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Validaciones específicas por rol
      if (formData.role === 'local') {
        if (!formData.businessName || !formData.businessAddress) {
          throw new Error('El nombre y dirección del negocio son obligatorios para locales');
        }
      }

      if (formData.role === 'rider') {
        if (!formData.phone) {
          throw new Error('El teléfono es obligatorio para repartidores');
        }
      }

      // Aquí se implementaría la creación del usuario con Firebase
      // Por ahora simulamos el proceso
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Usuario creado:', {
        ...formData,
        password: '[REDACTED]',
        confirmPassword: '[REDACTED]'
      });

      setSuccess(`Usuario ${formData.name} creado exitosamente como ${getRoleLabel(formData.role)}`);
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'rider',
        businessName: '',
        businessAddress: '',
        businessPhone: '',
        contactPerson: '',
        phone: '',
        vehicleType: 'moto',
        isActive: true
      });

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'operator': return 'Operador';
      case 'rider': return 'Repartidor';
      case 'local': return 'Local';
      default: return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return ShieldCheck;
      case 'operator': return Users;
      case 'rider': return Bike;
      case 'local': return Building;
      default: return Users;
    }
  };

  const RoleIcon = getRoleIcon(formData.role);

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Crear Usuario"
        icon={UserPlus} 
        subtitle="Agrega un nuevo usuario al sistema con el rol correspondiente."
        actions={
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/usuarios/lista">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Lista
            </Link>
          </Button>
        }
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RoleIcon className="h-5 w-5" />
            Nuevo {getRoleLabel(formData.role)}
          </CardTitle>
          <CardDescription>
            Completa la información para crear un nuevo usuario en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="juan@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Repetir contraseña"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Rol del Usuario *</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Administrador
                      </div>
                    </SelectItem>
                    <SelectItem value="operator">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Operador
                      </div>
                    </SelectItem>
                    <SelectItem value="rider">
                      <div className="flex items-center gap-2">
                        <Bike className="h-4 w-4" />
                        Repartidor
                      </div>
                    </SelectItem>
                    <SelectItem value="local">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Local
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Usuario activo</Label>
              </div>
            </div>

            {/* Campos específicos para Local */}
            {formData.role === 'local' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Información del Local
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Nombre del Negocio *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="Pizza Express"
                      required={formData.role === 'local'}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessPhone">Teléfono del Negocio</Label>
                    <Input
                      id="businessPhone"
                      value={formData.businessPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessPhone: e.target.value }))}
                      placeholder="223-123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessAddress">Dirección del Negocio *</Label>
                  <Input
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                    placeholder="Av. Colón 1234, Mar del Plata"
                    required={formData.role === 'local'}
                  />
                </div>

                <div>
                  <Label htmlFor="contactPerson">Persona de Contacto</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="Encargado o responsable"
                  />
                </div>
              </div>
            )}

            {/* Campos específicos para Rider */}
            {formData.role === 'rider' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Bike className="h-5 w-5" />
                  Información del Repartidor
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="223-123-4567"
                      required={formData.role === 'rider'}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="vehicleType">Tipo de Vehículo</Label>
                    <Select 
                      value={formData.vehicleType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moto">🏍️ Moto</SelectItem>
                        <SelectItem value="bici">🚴 Bicicleta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Alertas */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Creando Usuario...' : 'Crear Usuario'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 