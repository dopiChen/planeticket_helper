import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  LiveReload,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import 'antd/dist/reset.css';
import "./tailwind.css";
import ProtectedRoute from '~/components/ProtectedRoute';


export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/antd@5/dist/reset.css"
  },
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
  },
  // ... existing links code ...
];

export default function App() {
  return (
    <html lang="zh">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}