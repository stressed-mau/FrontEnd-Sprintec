import { useMemo, useState } from "react";
import Header from "../components/HeaderUser";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, ExternalLink, Globe, Plus, Trash2, X } from "lucide-react";

type NetworkItem = {
  id: number;
  name: string;
  url: string;
};

type FormValues = {
  name: string;
  url: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialNetworks: NetworkItem[] = [];

const emptyForm: FormValues = {
  name: "",
  url: "",
};

const MAX_NETWORKS = 10;

function validateNetworkField(field: keyof FormValues, values: FormValues): string {
  const name = values.name.trim();
  const url = values.url.trim();

  if (field === "name") {
    if (!name) {
      return "El campo Nombre de la red es obligatorio.";
    }

    if (name.length > 40) {
      return "El campo Nombre de la red permite un máximo de 40 caracteres.";
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name)) {
      return "El campo Nombre de la red contiene caracteres no válidos. Solo se permiten letras.";
    }
  }

  if (field === "url") {
    if (!url) {
      return "El campo URL es obligatorio.";
    }

    if (url.length > 100) {
      return "El campo URL permite un máximo de 100 caracteres.";
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return "Ingrese una URL válida.";
    }

    const hasValidProtocol =
      parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";

    if (!hasValidProtocol) {
      return "Ingrese una URL válida.";
    }

    const hostname = parsedUrl.hostname.trim();
    const hasValidDomain = /^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(hostname);

    if (!hasValidDomain) {
      return "La URL ingresada no es válida.";
    }
  }

  return "";
}

const NetworksPage = () => {
  const [networks, setNetworks] = useState<NetworkItem[]>(initialNetworks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("");

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const showFeedback = (message: string, type: "success" | "error") => {
    setFeedbackMessage(message);
    setFeedbackType(type);
  };

  const clearFeedback = () => {
    setFeedbackMessage("");
    setFeedbackType("");
  };

  const openCreateModal = () => {
    clearFeedback();

    if (networks.length >= MAX_NETWORKS) {
      showFeedback(
        "Ha alcanzado el límite máximo de 10 redes profesionales registradas.",
        "error",
      );
      return;
    }

    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (network: NetworkItem) => {
    clearFeedback();
    setEditingId(network.id);
    setFormData({ name: network.name, url: network.url });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
    setIsModalOpen(false);
  };

  const updateField = (field: keyof FormValues, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      const nextValues = { ...formData, [field]: value };
      setErrors((current) => ({
        ...current,
        [field]: validateNetworkField(field, nextValues),
      }));
    }
  };

  const handleBlur = (field: keyof FormValues) => {
    setErrors((current) => ({
      ...current,
      [field]: validateNetworkField(field, formData),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearFeedback();

    const nextErrors: FormErrors = {
      name: validateNetworkField("name", formData),
      url: validateNetworkField("url", formData),
    };

    setErrors(nextErrors);

    if (nextErrors.name || nextErrors.url) {
      return;
    }

    if (!isEditing && networks.length >= MAX_NETWORKS) {
      showFeedback(
        "Ha alcanzado el límite máximo de 10 redes profesionales registradas.",
        "error",
      );
      closeModal();
      return;
    }

    if (isEditing) {
      setNetworks((current) =>
        current.map((network) =>
          network.id === editingId
            ? { ...network, name: formData.name.trim(), url: formData.url.trim() }
            : network,
        ),
      );
      showFeedback("Red actualizada correctamente.", "success");
    } else {
      setNetworks((current) => [
        {
          id: Date.now(),
          name: formData.name.trim(),
          url: formData.url.trim(),
        },
        ...current,
      ]);
      showFeedback("Red agregada correctamente.", "success");
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    clearFeedback();
    setNetworks((current) => current.filter((network) => network.id !== id));
  };

  const getNetworkIcon = () => {
    return <Globe className="size-5" />;
  };

  return (
    <div className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-center sm:text-left">
                <h1 className="mb-2 text-3xl font-bold text-[#003A6C] md:text-4xl">
                  Redes profesionales
                </h1>
                <p className="text-sm text-[#4B778D] md:text-base">
                  Gestiona los enlaces que aparecerán en tu portafolio público.
                </p>
              </div>

              <Button
                type="button"
                onClick={openCreateModal}
                className="h-11 bg-[#003A6C] px-5 text-white hover:bg-[#1a4f7a]"
              >
                <Plus className="mr-2 size-4" />
                Agregar enlace
              </Button>
            </div>

            {feedbackMessage ? (
              <div
                className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                  feedbackType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {feedbackMessage}
              </div>
            ) : null}

            {networks.length === 0 ? (
              <Card className="rounded-3xl border-2 border-dashed border-[#6dacbf] bg-white py-0 shadow-sm">
                <CardContent className="px-6 py-14 text-center">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#D9EAF4] text-[#003A6C]">
                    <Globe className="size-8" />
                  </div>
                  <h2 className="mb-2 text-xl font-semibold text-[#003A6C]">
                    No hay redes registradas.
                  </h2>
                  <p className="mx-auto mb-6 max-w-md text-sm text-[#4B778D]">
                    Puedes añadir enlaces profesionales para mostrarlos en tu portafolio
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {networks.map((network) => (
                  <Card
                    key={network.id}
                    className="rounded-3xl border border-[#A5D7E8] bg-white py-0 shadow-sm"
                  >
                    <CardHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#D9EAF4] text-[#003A6C]">
                            {getNetworkIcon()}
                          </div>

                          <div className="min-w-0">
                            <CardTitle className="text-lg font-semibold text-[#003A6C]">
                              {network.name}
                            </CardTitle>
                            <a
                              href={network.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 flex items-center gap-2 break-all text-sm text-[#4982AD] hover:text-[#003A6C]"
                            >
                              <span>{network.url}</span>
                              <ExternalLink className="size-3 shrink-0" />
                            </a>
                          </div>
                        </div>

                        <div className="flex gap-2 self-end sm:self-start">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(network)}
                            className="border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(network.id)}
                            className="border-[#F2C6C6] bg-white text-[#B42318] hover:bg-[#FFF1F1]"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
                      <p className="text-sm text-[#4B778D]">
                        Diseño de frontend listo. La integración real con backend puede conectarse
                        después.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#003A6C]/45 px-3 sm:items-center sm:px-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-[#A5D7E8] bg-white shadow-2xl sm:rounded-3xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#D7E6F2] px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-2xl font-bold text-[#003A6C]">
                  {isEditing ? "Editar enlace" : "Nuevo enlace"}
                </h2>
                <p className="mt-1 text-sm text-[#4B778D]">
                  Completa los campos para mostrar esta red en tu perfil.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1 text-[#003A6C] transition hover:bg-[#EEF5F9]"
                aria-label="Cerrar modal"
              >
                <X className="size-5" />
              </button>
            </div>

            <form noValidate onSubmit={handleSubmit} className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
              <div className="space-y-2">
                <Label htmlFor="network-name" className="text-[#003A6C]">
                  Nombre de la red
                </Label>
                <Input
                  id="network-name"
                  maxLength={40}
                  value={formData.name}
                  onBlur={() => handleBlur("name")}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="LinkedIn, GitHub, Portfolio..."
                  className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "network-name-error" : undefined}
                />
                {errors.name ? (
                  <p id="network-name-error" className="text-sm text-red-600">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="network-url" className="text-[#003A6C]">
                  URL
                </Label>
                <Input
                  id="network-url"
                  type="url"
                  maxLength={100}
                  value={formData.url}
                  onBlur={() => handleBlur("url")}
                  onChange={(e) => updateField("url", e.target.value)}
                  placeholder="https://..."
                  className="h-11 border-[#A5D7E8] bg-white text-[#003A6C] placeholder:text-[#7B98AF]"
                  aria-invalid={Boolean(errors.url)}
                  aria-describedby={errors.url ? "network-url-error" : undefined}
                />
                {errors.url ? (
                  <p id="network-url-error" className="text-sm text-red-600">
                    {errors.url}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  type="submit"
                  className="h-11 flex-1 bg-[#003A6C] text-white hover:bg-[#1a4f7a]"
                >
                  Guardar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="h-11 flex-1 border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NetworksPage;
