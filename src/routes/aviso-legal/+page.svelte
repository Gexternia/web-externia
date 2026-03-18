<script lang="ts">
  import { onMount } from 'svelte';

  let isLight = $state(false);
  onMount(() => {
    isLight = document.documentElement.classList.contains('light');
    const handler = () => { isLight = document.documentElement.classList.contains('light'); };
    window.addEventListener('themechange', handler);
    return () => window.removeEventListener('themechange', handler);
  });
</script>

<svelte:head>
  <title>Aviso legal — Externia</title>
</svelte:head>

<div class="min-h-screen py-24 px-4 {isLight ? 'bg-gray-50 text-gray-900' : 'bg-[#0a0a14] text-gray-100'}">
  <div class="max-w-3xl mx-auto space-y-4 text-base leading-relaxed">
    <h1 class="text-3xl font-bold mb-8">AVISO LEGAL</h1>
    <p>
      Externia se reserva el derecho de modificar cualquier tipo de información que pudiera aparecer en el sitio web, sin que exista obligación de preavisar o poner en conocimiento de los usuarios dichas obligaciones, entendiéndose como suficiente con la publicación en el sitio web de Externia.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Datos identificativos</h2>
    <p>
      En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico, a continuación, se exponen los datos identificativos de la empresa/propietario del dominio <a href="https://web-externia.onrender.com/" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">https://web-externia.onrender.com</a>:
    </p>
    <ul class="list-none space-y-1 my-6">
      <li><strong>Nombre de dominio:</strong> web-externia.onrender.com</li>
      <li><strong>Denominación social:</strong> Externia</li>
      <li><strong>CIF/NIF:</strong> [INTRODUCIR NÚMERO DE IDENTIFICACIÓN]</li>
      <li><strong>Domicilio social:</strong> [INTRODUCIR DIRECCIÓN FÍSICA]</li>
      <li><strong>E-mail:</strong> [INTRODUCIR CORREO ELECTRÓNICO]</li>
      <li><strong>Datos registrales:</strong> [INTRODUCIR DATOS DE REGISTRO, EJ: REGISTRO MERCANTIL DE...]</li>
    </ul>

    <h2 class="text-xl font-semibold mt-8 mb-4">Derechos de propiedad intelectual e industrial</h2>
    <p>
      El sitio web, incluyendo a título enunciativo pero no limitativo su programación, edición, compilación y demás elementos necesarios para su funcionamiento, los diseños, logotipos, texto y/o gráficos, son propiedad del responsable o, si es el caso, dispone de licencia o autorización expresa por parte de los autores.
    </p>
    <p>
      Todos los contenidos del sitio web se encuentran debidamente protegidos por la normativa de propiedad intelectual e industrial, así como inscritos en los registros públicos correspondientes. Independientemente de la finalidad para la que fueran destinados, la reproducción total o parcial, uso, explotación, distribución y comercialización, requiere en todo caso de la autorización escrita previa por parte del responsable. Cualquier uso no autorizado previamente se considera un incumplimiento grave de los derechos de propiedad intelectual o industrial del autor.
    </p>
    <p>
      Los diseños, logotipos, texto y/o gráficos ajenos al responsable y que pudieran aparecer en el sitio web, pertenecen a sus respectivos propietarios, siendo ellos mismos responsables de cualquier posible controversia que pudiera suscitarse respecto a los mismos. El responsable autoriza expresamente a que terceros puedan redirigir directamente a los contenidos concretos del sitio web, y en todo caso redirigir al sitio web principal de <a href="https://web-externia.onrender.com/" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">https://web-externia.onrender.com</a>.
    </p>
    <p>
      Para realizar cualquier tipo de observación respecto a posibles incumplimientos de los derechos de propiedad intelectual o industrial, así como sobre cualquiera de los contenidos del sitio web, puede hacerlo a través del correo electrónico [INTRODUCIR EMAIL] o a la siguiente dirección postal: [INTRODUCIR DIRECCIÓN].
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Navegación, acceso y seguridad</h2>
    <p>
      El acceso, navegación y utilización de esta página web implica por tu parte la aceptación expresa y sin reservas de todos los términos del presente Aviso Legal y la Política de Privacidad, teniendo la misma validez y eficacia que cualquier contrato celebrado por escrito y firmado.
    </p>
    <p>
      Externia realiza los máximos esfuerzos para que la navegación se realice en las mejores condiciones y evitar los perjuicios de cualquier tipo que pudiesen ocasionarse durante la misma. Externia no se responsabiliza ni garantiza que el acceso a este Sitio web sea ininterrumpido o que esté libre de error. Tampoco se responsabiliza o garantiza que el contenido o software al que pueda accederse esté libre de error o cause un daño.
    </p>
    <p>
      Queda prohibido el acceso a este Sitio Web por parte de menores de 14 años, salvo que cuenten con la autorización previa y expresa de sus padres, tutores o representantes legales.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Exención de responsabilidades del responsable</h2>
    <p>
      Se exime de cualquier tipo de responsabilidad derivada de la información publicada en su sitio web siempre que esta información haya sido manipulada o introducida por un tercero ajeno al mismo.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Política de enlaces</h2>
    <p>
      Desde el sitio web, es posible que se redirija a contenidos de terceros. Dado que el responsable no puede controlar siempre los contenidos introducidos por terceros, no asume ningún tipo de responsabilidad respecto a dichos contenidos. En todo caso, se procederá a la retirada inmediata de cualquier contenido que pudiera contravenir la legislación nacional o internacional, la moral o el orden público.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Condiciones adicionales</h2>
    <p>
      El usuario que introduce los datos es el responsable único y final de la veracidad de la información suministrada en el servicio y en las modificaciones de los mismos que pueda realizar.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Actualización y modificación de la información</h2>
    <p>
      La información que aparece en este sitio web es la vigente en la fecha de su última actualización. Externia se reserva el derecho a actualizar, modificar o eliminar la información de este sitio web, pudiendo limitar o no permitir el acceso al mismo sin previo aviso.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Ley aplicable y jurisdicción</h2>
    <p>
      Las presentes Condiciones se regirán e interpretarán de acuerdo con la legislación común española. Para cuantas cuestiones pudieran surgir sobre la interpretación, cumplimiento o rescisión de las Condiciones, las Partes se someten a la jurisdicción y competencia de los Juzgados y Tribunales de la ciudad de [CIUDAD, EJ: MADRID].
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">PROTECCIÓN DE DATOS DE CARÁCTER PERSONAL (INFORMACIÓN BÁSICA)</h2>
    <div class="overflow-x-auto my-6">
      <table class="w-full border-collapse border {isLight ? 'border-gray-300' : 'border-white/20'}">
        <tbody>
          <tr class={isLight ? 'border-b border-gray-200' : 'border-b border-white/20'}>
            <td class="py-3 px-4 font-semibold {isLight ? 'bg-gray-100' : 'bg-white/5'}">Campo</td>
            <td class="py-3 px-4 font-semibold {isLight ? 'bg-gray-100' : 'bg-white/5'}">Información</td>
          </tr>
          <tr class={isLight ? 'border-b border-gray-200' : 'border-b border-white/20'}>
            <td class="py-3 px-4 font-medium">Responsable</td>
            <td class="py-3 px-4">Externia</td>
          </tr>
          <tr class={isLight ? 'border-b border-gray-200' : 'border-b border-white/20'}>
            <td class="py-3 px-4 font-medium">Finalidad</td>
            <td class="py-3 px-4">Prestar los servicios ofrecidos a través de la web o atender solicitudes y gestiones del usuario.</td>
          </tr>
          <tr class={isLight ? 'border-b border-gray-200' : 'border-b border-white/20'}>
            <td class="py-3 px-4 font-medium">Legitimación</td>
            <td class="py-3 px-4">Consentimiento del interesado (Reglamento UE 2016/679 y LOPDGDD 3/2018).</td>
          </tr>
          <tr class={isLight ? 'border-b border-gray-200' : 'border-b border-white/20'}>
            <td class="py-3 px-4 font-medium">Destinatarios</td>
            <td class="py-3 px-4">Fichero interno de Externia y terceros necesarios para la prestación del servicio bajo autorización legal.</td>
          </tr>
          <tr class={isLight ? 'border-b border-gray-200' : 'border-b border-white/20'}>
            <td class="py-3 px-4 font-medium">Derechos</td>
            <td class="py-3 px-4">Acceso, rectificación, cesión, oposición y derecho al olvido.</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-medium">Información adicional</td>
            <td class="py-3 px-4">Puede consultar la información detallada en nuestra <a href="/politica-privacidad" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">Política de Privacidad</a>.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="mt-8 pt-6 border-t {isLight ? 'border-gray-200' : 'border-white/10'} text-sm opacity-80">
      Fecha última actualización: 18/03/2026
    </p>
  </div>
</div>
