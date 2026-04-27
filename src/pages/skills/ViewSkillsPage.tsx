import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { Code2, Lightbulb } from 'lucide-react';
import { useSkillsManager } from '../../hooks/useSkillsManager';

const LEVEL_LABELS: Record<string, string> = {
  experto: 'Experto', avanzado: 'Avanzado', intermedio: 'Intermedio', basico: 'Basico',
};

const ViewSkillsPage = () => {
  const { technicalSkills, softSkills, pageError } = useSkillsManager();

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="mb-2 text-3xl font-bold text-[#003A6C]">Mis Habilidades</h1>
            <p className="text-[#4B778D] mb-8">Visualiza tus competencias técnicas y habilidades blandas registradas.</p>

            {pageError && <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 text-red-900 rounded-2xl">{pageError}</div>}

            <section className="mb-10">
              <div className="flex items-center gap-2 mb-6 text-[#003A6C]">
                <Code2 className="size-6" />
                <h2 className="text-2xl font-bold">Habilidades Técnicas</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technicalSkills.map(skill => (
                  <div key={skill.id} className="bg-white p-4 rounded-2xl border border-[#6dacbf]/30 shadow-sm flex justify-between items-center">
                    <span className="font-bold text-[#003A6C]">{skill.name}</span>
                    <span className="text-xs bg-[#F1F5F9] px-3 py-1 rounded-full text-gray-500 font-medium">
                      {LEVEL_LABELS[skill.level || ''] || skill.level}
                    </span>
                  </div>
                ))}
              </div>
              <div className="w-full py-20 border-2 border-dashed border-[#6dacbf]/50 rounded-[2rem] flex items-center justify-center bg-white/50">
                   <p className="text-[#4B778D] font-medium">No hay habilidades técnicas registradas</p>  </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-6 text-[#003A6C]">
                <Lightbulb className="size-6" />
                <h2 className="text-2xl font-bold">Habilidades Blandas</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {softSkills.map(skill => (
                  <div key={skill.id} className="bg-white p-4 rounded-2xl border border-[#6dacbf]/30 shadow-sm">
                    <span className="font-bold text-[#003A6C]">{skill.name}</span>
                  </div>
                ))}
              </div>
              <div className="w-full py-20 border-2 border-dashed border-[#6dacbf]/50 rounded-[2rem] flex items-center justify-center bg-white/50">
                <p className="text-[#4B778D] font-medium">No hay habilidades blandas registradas</p> </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ViewSkillsPage;