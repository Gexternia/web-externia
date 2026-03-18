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
  <title>Política de Cookies — Externia</title>
</svelte:head>

<div class="min-h-screen py-24 px-4 {isLight ? 'bg-gray-50 text-gray-900' : 'bg-[#0a0a14] text-gray-100'}">
  <div class="max-w-3xl mx-auto space-y-4 text-base leading-relaxed">
    <h1 class="text-3xl font-bold mb-8">POLÍTICA DE COOKIES</h1>
    <p>
      Externia informa acerca del uso de las cookies en su página web: <a href="https://web-externia.onrender.com/" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">https://web-externia.onrender.com/</a>
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">¿Qué son las cookies?</h2>
    <p>
      Las cookies son archivos que se pueden descargar en su equipo a través de las páginas web. Son herramientas que tienen un papel esencial para la prestación de numerosos servicios de la sociedad de la información. Entre otros, permiten a una página web almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información obtenida, se pueden utilizar para reconocer al usuario y mejorar el servicio ofrecido.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Tipos de cookies</h2>
    <p>
      Según quien sea la entidad que gestione el dominio desde donde se envían las cookies y trate los datos que se obtengan se pueden distinguir dos tipos:
    </p>
    <ul class="list-disc pl-6 space-y-2 my-4">
      <li><strong>Cookies propias:</strong> Aquéllas que se envían al equipo terminal del usuario desde un equipo o dominio gestionado por el propio editor y desde el que se presta el servicio solicitado por el usuario.</li>
      <li><strong>Cookies de terceros:</strong> Aquéllas que se envían al equipo terminal del usuario desde un equipo o dominio que no es gestionado por el editor, sino por otra entidad que trata los datos obtenidos través de las cookies.</li>
    </ul>
    <p>
      Existe también una segunda clasificación según el plazo de tiempo que permanecen almacenadas en el navegador del cliente:
    </p>
    <ul class="list-disc pl-6 space-y-2 my-4">
      <li><strong>Cookies de sesión:</strong> Diseñadas para recabar y almacenar datos mientras el usuario accede a una página web.</li>
      <li><strong>Cookies persistentes:</strong> Los datos siguen almacenados en el terminal y pueden ser accedidos y tratados durante un periodo definido por el responsable de la cookie.</li>
    </ul>
    <p>
      Por último, existen cookies según la finalidad para la que se traten los datos: técnicas, de personalización, de análisis, publicitarias, de publicidad comportamental y de redes sociales externas.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Desactivación y eliminación de cookies</h2>
    <p>
      Tienes la opción de permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador instalado en su equipo. Al desactivar cookies, algunos de los servicios disponibles podrían dejar de estar operativos.
    </p>
    <p class="mt-4">
      Puede usted configurar su navegador en los siguientes enlaces:
    </p>
    <ul class="list-disc pl-6 space-y-2 my-4">
      <li><strong>Microsoft Edge:</strong> <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">Enlace de soporte</a></li>
      <li><strong>Mozilla Firefox:</strong> <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">Enlace de soporte</a></li>
      <li><strong>Chrome:</strong> <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">Enlace de soporte</a></li>
      <li><strong>Safari:</strong> <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">Enlace de soporte</a></li>
      <li><strong>Opera:</strong> <a href="https://help.opera.com/es/latest/web-preferences/#cookies" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">Enlace de soporte</a></li>
    </ul>

    <h2 class="text-xl font-semibold mt-8 mb-4">Cookies utilizadas en este portal</h2>
    <p>
      A continuación, se identifican las cookies que están siendo utilizadas en este portal:
    </p>
    <p>
      La web <a href="https://web-externia.onrender.com/" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">https://web-externia.onrender.com</a> no utiliza cookies para recoger información de las personas o usuarias. Únicamente utiliza cookies propias, de sesión, con finalidad técnica (aquellas que permiten a la persona o usuario la navegación a través del sitio web y la utilización de las diferentes opciones y servicios que en ella existen).
    </p>
    <p>
      <a href="https://web-externia.onrender.com/" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">https://web-externia.onrender.com</a> muestra información sobre su Política de cookies en la parte inferior o superior de cualquier página del portal con cada inicio de sesión. Ante esta información es posible llevar a cabo las siguientes acciones:
    </p>
    <ul class="list-disc pl-6 space-y-2 my-4">
      <li><strong>Aceptar cookies:</strong> No se volverá a visualizar este aviso al acceder a cualquier página del portal durante la presente sesión.</li>
      <li><strong>Modificar/personalizar su configuración:</strong> Podrá obtener más información sobre qué son las cookies, conocer la Política de cookies de Externia y modificar la configuración de su navegador.</li>
    </ul>

    <p class="mt-8 pt-6 border-t {isLight ? 'border-gray-200' : 'border-white/10'} text-sm opacity-80">
      Fecha última actualización: 18/03/2026
    </p>
  </div>
</div>
