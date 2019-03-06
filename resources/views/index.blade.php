<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="{{ url('favicon.ico') }}" />

    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <meta name="theme-color" content="#000000" />

    <!--
      manifest.json provides metadata used when your web app is added to the
      homescreen on Android. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="{{ url('manifest.json') }}" />

    <title>Carpentree Framework</title>

    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body>
<noscript>You need to enable JavaScript to run this app.</noscript>

<div id="root"></div>

<!--
  This HTML file is a template.
  If you open it directly in the browser, you will see an empty page.

  You can add webfonts, meta tags, or analytics to this file.
  The build step will place the bundled scripts into the <body> tag.

  To begin the development, run `npm start` or `yarn start`.
  To create a production bundle, use `npm run build` or `yarn build`.
-->

<script src="{{ asset('js/index.js') }}"></script>
</body>
</html>