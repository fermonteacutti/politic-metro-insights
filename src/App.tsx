import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PerfilPolitico from "./pages/PerfilPolitico.tsx";
import CidadaniaEmFoco from "./pages/CidadaniaEmFoco.tsx";
import Metodologia from "./pages/Metodologia.tsx";
import Quiz from "./pages/Quiz.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/politico/:id" element={<PerfilPolitico />} />
          <Route path="/politico/:source/:id" element={<PerfilPolitico />} />
          <Route path="/cidadania" element={<CidadaniaEmFoco />} />
          <Route path="/metodologia" element={<Metodologia />} />
          <Route path="/quiz" element={<Quiz />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
