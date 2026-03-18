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
  <title>Política de privacidad — Externia</title>
</svelte:head>

<div class="min-h-screen py-24 px-4 {isLight ? 'bg-gray-50 text-gray-900' : 'bg-[#0a0a14] text-gray-100'}">
  <div class="max-w-3xl mx-auto space-y-4 text-base leading-relaxed">
    <h1 class="text-3xl font-bold mb-8">POLÍTICA DE PRIVACIDAD Y PROTECCIÓN DE DATOS</h1>

    <h2 class="text-xl font-semibold mt-8 mb-4">Recogida, tratamiento y uso de los datos personales en la web</h2>
    <p>
      En base a lo dispuesto en el Reglamento General de Protección de Datos 2016/679 (RGPD) y en la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de derechos digitales (LOPDGDD), le informamos que para hacer uso algunos de los servicios que les ofrece nuestra web, puede ser necesario que nos suministre determinados datos de carácter personal que serán incorporados a ficheros automatizados.
    </p>
    <p>
      Cumpliendo con las nuevas disposiciones del Reglamento (UE) 2016/679 del PE y del Consejo de 27 de abril de 2016 y de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de derechos digitales, relativas a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos y por el que se deroga la Directiva 95/46/CE, le informamos que el responsable del tratamiento de los datos es:
    </p>
    <ul class="list-none space-y-1 my-6">
      <li><strong>Nombre/Empresa:</strong> Externia</li>
      <li><strong>CIF:</strong> [INTRODUCIR CIF/NIF]</li>
      <li><strong>Domicilio social:</strong> [INTRODUCIR DIRECCIÓN POSTAL]</li>
      <li><strong>Correo electrónico:</strong> [INTRODUCIR EMAIL DE CONTACTO]</li>
      <li><strong>Página web:</strong> <a href="https://web-externia.onrender.com/" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">https://web-externia.onrender.com/</a></li>
    </ul>

    <p>
      Para realizar cualquier tipo de observación respecto a posibles incumplimientos de los derechos de propiedad intelectual o industrial, así como sobre cualquiera de los contenidos del sitio web, puede hacerlo poniéndose en contacto con la empresa a través de cualquiera de los medios indicados anteriormente.
    </p>
    <p>
      Los contenidos del Sitio Web tienen como finalidad informar a los Usuarios de los servicios ofrecidos por la empresa como consecuencia de las solicitudes, gestiones o trámites que el Usuario realice mediante la web. Los datos objeto de tratamiento serán aquellos que nos facilite a través de los formularios que en cada momento contenga la página o a través de los correos electrónicos que el Usuario dirija a las direcciones de correo electrónico identificadas en la misma, así como aquellos otros que se generen durante el mantenimiento de la relación correspondiente.
    </p>
    <p>
      Todos los campos que aparecen señalados como obligatorios en cualquiera de los formularios deberán ser cumplimentados necesariamente, de tal modo que la omisión de alguno de ellos podrá comportar la imposibilidad de que podamos atender su solicitud o prestarle los servicios correspondientes.
    </p>
    <p>
      Adicionalmente, durante dicha recogida de datos, es posible que se solicite su consentimiento para otra serie de finalidades que no guardan una relación directa con el servicio o la relación correspondiente. En el caso de que no esté de acuerdo con dichos tratamientos adicionales, marque la casilla destinada al efecto según corresponda.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Solicitantes de información</h2>
    <p>
      Los datos personales utilizados en estos casos proceden del propio interesado, el cual los proporciona a Externia al completar el formulario de contacto contenido en el Sitio Web, al efectuar una llamada telefónica, o al enviar un correo. Estos datos se utilizan con la finalidad de resolver las consultas y proporcionar información a aquellos que lo demanden o lo autoricen expresamente, principalmente por medio del correo electrónico.
    </p>

    <p class="mt-6">
      La persona que acceda a este Sitio Web (en adelante, el Usuario), asegura que tiene la edad mínima legal establecida por el Reglamento General de Protección de Datos 679/2016 o por la normativa nacional que le sea de aplicación para otorgar el consentimiento en relación con los Servicios de la Sociedad de la Información.
    </p>
    <p>
      Mediante el acceso a este Sitio Web, el Usuario acepta expresamente todas las cláusulas de su información legal, de esta política de privacidad, y de su política de cookies, así como de todas aquellas condiciones particulares recogidas para la utilización de determinados servicios. En caso de no aceptar alguna de las citadas cláusulas, el Usuario deberá abstenerse de acceder a este Sitio Web.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Redes sociales</h2>
    <p>
      Externia mantiene perfiles en varias redes sociales. Además, los servicios pueden incorporar funcionalidades de redes sociales, por ejemplo, servicios de mensajería. En tu uso o interacción con esas funcionalidades podemos recopilar información sobre tu usuario en dicha red social. Si utilizas las redes sociales, los operadores de redes sociales determinan la naturaleza, el alcance y los propósitos del tratamiento de los datos en las mismas. Estas redes sociales tienen sus propias políticas de privacidad, mediante las cuales te explicarán cómo utilizan y comparten tu información personal. Te recomendamos revisar detenidamente las políticas de privacidad antes de utilizar estas redes sociales para estar seguro de que estás conforme con la forma en la que tu información personal se recopila y comparte.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Elaboración de perfiles</h2>
    <p>
      La empresa no realiza procesos de elaboración de perfiles ni toma decisiones automatizadas sobre la base de los datos personales facilitados por los usuarios, de conformidad con lo dispuesto en el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD). En caso de que en el futuro se implementaran mecanismos de segmentación automatizada o perfilado, se informará previamente a los interesados de forma clara, especificando la lógica utilizada, la importancia y las consecuencias previstas de dicho tratamiento.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Uso imagen</h2>
    <p>
      Todas las imágenes/videos que publicamos, son única y exclusivamente con la finalidad de informar de la actividad que llevamos a cabo, y porque hemos recabado el consentimiento del interesado (art. 6.1.a GDPR). Si alguna persona se considera afectada por la publicación de su imagen y no quiere que se difunda, solo será necesario que lo transmita por e-mail a [INTRODUCIR EMAIL DE CONTACTO] e inmediatamente procederemos a eliminarla.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Finalidad del tratamiento de los datos personales</h2>
    <p>
      En Externia trataremos sus datos personales con las siguientes finalidades:
    </p>
    <ul class="list-disc pl-6 space-y-2 my-4">
      <li>Sus datos identificativos (por ejemplo, su nombre, apellido, datos de contacto, etc.) para gestionar sus solicitudes y mantenimiento de relación contractual.</li>
      <li>Información económica y transaccional.</li>
      <li>Datos de conexión y navegación.</li>
      <li>Información comercial.</li>
      <li><strong>Navegar por la web y utilizar nuestros medios digitales:</strong> Tratamos la información para permitir y facilitarle el acceso y navegación por nuestros medios digitales, así como para prestarte los servicios que ofrecemos a través de los mismos.</li>
      <li><strong>Mejorar los servicios que ofrecemos y la seguridad:</strong> Otros de los usos para los que empleamos la información es para lograr el mantenimiento, la mejora y la eficacia de nuestros servicios y medios digitales que nos permiten el desarrollo de nuevas funcionalidades, proteger la seguridad de sus datos y de nuestros medios digitales, detectar y prevenir el fraude en las transacciones.</li>
      <li><strong>Datos del curriculum vitae</strong> que nos envíe a través de cualquier vía. La finalidad es la de evaluar su candidatura en caso de que en un futuro surja alguna vacante que se ajuste a sus características.</li>
    </ul>
    <p>
      Asimismo, le recordamos que puede oponerse al envío de comunicaciones comerciales por cualquier vía y en cualquier momento, dirigiéndose a Externia.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Legitimación</h2>
    <p>
      El tratamiento de sus datos se realiza con las siguientes bases jurídicas que legitiman el mismo:
    </p>
    <p>
      El consentimiento libre, específico, informado e inequívoco, en tanto que le informamos poniendo a su disposición la presente política de privacidad, que tras la lectura de la misma, en caso de estar conforme, puede aceptar mediante una declaración o una clara acción afirmativa, como el marcado de una casilla dispuesta al efecto.
    </p>
    <p>
      En caso de que no nos facilite sus datos o los haga de forma errónea o incompleta, no podremos atender su solicitud, resultando del todo imposible proporcionarle la información solicitada o llevar a cabo la contratación de los servicios.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Garantía</h2>
    <p>
      El Usuario garantiza que los datos aportados son verdaderos, exactos, completos y actualizados, siendo responsable de cualquier daño o perjuicio, directo o indirecto, que pudiera ocasionarse como consecuencia del incumplimiento de tal obligación. En el caso de que los datos aportados pertenecieran a un tercero, el Usuario garantiza que ha informado a dicho tercero y obtenido su autorización para facilitar sus datos personales a Externia.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Conservación de los datos</h2>
    <p>
      Sus datos se conservarán mientras se mantenga la relación contractual o durante los años necesarios para cumplir con las obligaciones legales, mientras no solicite su cese o durante el tiempo necesario para la realización de los fines necesarios para los recabados.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Destinatarios</h2>
    <p>
      Sus datos serán conservados bajo estrictas medidas de seguridad que garanticen la confidencialidad, integridad y disponibilidad de la información, y únicamente serán tratados por terceros cuando resulte necesario para la correcta prestación del servicio o el cumplimiento de obligaciones legales.
    </p>
    <p>
      En este sentido, los datos podrán ser comunicados o cedidos a las siguientes entidades:
    </p>
    <ul class="list-disc pl-6 space-y-2 my-4">
      <li><strong>Entidades y proveedores</strong> que prestan servicios a Externia, tales como servicios de alojamiento web, mantenimiento informático, asesoría, gestión administrativa, herramientas de comunicación o gestión de campañas, entre otros, siempre para la correcta realización de los servicios contratados o solicitados. Todos estos proveedores se encuentran debidamente acreditados, actúan como encargados del tratamiento conforme al artículo 28 del Reglamento (UE) 2016/679 y han suscrito con Externia el correspondiente contrato de tratamiento de datos.</li>
      <li><strong>Organismos públicos, administraciones y autoridades competentes</strong>, cuando resulte necesario para el cumplimiento de las normativas aplicables o de requerimientos legales o judiciales.</li>
    </ul>
    <p>
      Asimismo, le informamos de que para la ejecución de determinados servicios, Externia podrá contratar proveedores que traten datos personales fuera del Espacio Económico Europeo (EEE). En tales casos, se garantiza que dichas transferencias internacionales se realizarán con las debidas garantías de seguridad según el Reglamento (UE) 2016/679.
    </p>
    <p>
      Externia exigirá a todos sus proveedores y colaboradores el cumplimiento estricto de la normativa en materia de protección de datos y la firma de los correspondientes acuerdos de confidencialidad.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Derechos</h2>
    <p>
      Como interesado, tienes pleno derecho a obtener confirmación sobre si en Externia estamos tratando tus datos personales, y estás facultado para ejercitar los siguientes derechos:
    </p>
    <ul class="list-disc pl-6 space-y-2 my-4">
      <li>Derecho de <strong>ACCESO</strong> a tus datos personales.</li>
      <li>Derecho de solicitar la <strong>RECTIFICACIÓN</strong> de los datos inexactos.</li>
      <li>Derecho de solicitar su <strong>SUPRESIÓN</strong> cuando ya no sean necesarios.</li>
      <li>Derecho a la <strong>LIMITACIÓN DEL TRATAMIENTO</strong> en determinadas circunstancias.</li>
      <li>Derecho de <strong>OPOSICIÓN</strong> al tratamiento de sus datos.</li>
      <li>Derecho a la <strong>PORTABILIDAD</strong> de los datos.</li>
    </ul>
    <p>
      Podrás ejercer tales derechos presentando copia de un documento identificativo y exponiendo brevemente su caso mediante carta dirigida a Externia en la dirección postal [INTRODUCIR DIRECCIÓN POSTAL], o a través del correo electrónico [INTRODUCIR EMAIL DE CONTACTO].
    </p>
    <p>
      Además, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en <a href="https://sedeagpd.gob.es/sede-electronica-web/" target="_blank" rel="noopener noreferrer" class="underline {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-cyan-400 hover:text-cyan-300'}">https://sedeagpd.gob.es/sede-electronica-web/</a>.
    </p>

    <h2 class="text-xl font-semibold mt-8 mb-4">Modificaciones</h2>
    <p>
      Nos reservamos el derecho a modificar este aviso para adaptarlo a las novedades legislativas o jurisprudenciales que vayan surgiendo, así como a las prácticas de la industria.
    </p>
    <p>
      Externia se reserva el derecho a modificar, total o parcialmente, la presente Política de Privacidad, publicando los cambios en el Sitio Web. Se entenderán como vigentes las condiciones publicadas en el momento en el que el Usuario acceda.
    </p>

    <p class="mt-8 pt-6 border-t {isLight ? 'border-gray-200' : 'border-white/10'} text-sm opacity-80">
      Fecha última actualización: 18/03/2026
    </p>
  </div>
</div>
