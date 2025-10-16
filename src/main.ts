import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-center">
        <div class="w-full max-w-md">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="text-center mb-6">
              <div class="mb-4">
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mx-auto">
                  <circle cx="20" cy="20" r="18" fill="#0066CC"/>
                  <text x="45" y="25" font-family="Inter, sans-serif" font-size="18" font-weight="600" fill="#0066CC">pacífico</text>
                </svg>
              </div>
              <h1 class="text-2xl font-semibold mb-2 text-gray-900">Bienvenido</h1>
              <p class="text-gray-600">Te pedimos crear tu contraseña.</p>
            </div>
            
            <form id="passwordForm" class="space-y-4">
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Ingresar" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
                <div class="mt-2 text-sm text-gray-600 space-y-1">
                  <div class="flex items-center">
                    <span class="text-green-500 mr-2">✓</span>
                    <span>Debe tener al menos un número.</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-green-500 mr-2">✓</span>
                    <span>Debe tener al menos un símbolo.</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-green-500 mr-2">✓</span>
                    <span>Debe tener al menos una letra mayúscula.</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-green-500 mr-2">✓</span>
                    <span>Debe tener al menos 8 caracteres.</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirma tu contraseña</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="Ingresar" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>
              
              <div class="flex items-start">
                <input 
                  type="checkbox" 
                  id="terms" 
                  name="terms" 
                  class="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label for="terms" class="text-sm text-gray-600">
                  Acepto los <a href="#" class="text-blue-600 hover:underline">términos y condiciones</a>
                </label>
              </div>
              
              <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                Siguiente
              </button>
            </form>
          </div>
          
          <div class="text-center text-xs text-gray-500 mt-6 px-4">
            Esta página web está protegida por reCAPTCHA y se aplican las Políticas de privacidad y los Términos de servicio de Google.<br>
            Pacífico Compañía de Seguros y Reaseguros RUC:20332704171 / Pacífico S.A. Entidad Prestadora de Salud RUC:20431115825
          </div>
        </div>
      </div>
    </div>
  </div>
`
