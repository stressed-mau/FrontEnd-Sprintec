import { Code2, Lightbulb } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ExperiencePagination } from '@/components/experience/ExperiencePagination';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { useSkillsManager } from '@/hooks/skills/useSkillsManager';
import { usePagination } from '@/hooks/usePagination';
import SkillsSearchBar from '@/components/skills/skillsSearchBar';
import SkillsLoading from '@/components/skills/SkillsLoading';
import SkillsEmptyState from '@/components/skills/SkillsEmptyState';
import SkillLevelBadge from '@/components/skills/SkillLevelBadge';
import Header from '../../components/HeaderUser';
import Sidebar from '../../components/Sidebar';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

const ViewSkillsPage = () => {
  const { filteredTechnicalSkills, filteredSoftSkills, pageError, setPageError,isLoading, searchQuery, setSearchQuery,
  } = useSkillsManager();
  const technicalPagination = usePagination({ items: filteredTechnicalSkills, itemsPerPage: 5 });
  const softPagination = usePagination({ items: filteredSoftSkills, itemsPerPage: 5 });

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <SectionHeader
              title="Ver Habilidades"
              description="Gestiona tus habilidades técnicas y blandas"
            />

            <SkillsSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar por nombre o nivel..." />

            {isLoading ? (
              <SkillsLoading />
            ) : (
              <>
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[#003A6C]">
                    <Code2 className="size-5" />
                    <h2 className="text-xl sm:text-2xl">Habilidades Técnicas</h2>
                  </div>

                  {filteredTechnicalSkills.length === 0 ? (
                    <SkillsEmptyState
                      searchQuery={searchQuery}
                      emptyMessage="No hay habilidades técnicas registradas"
                      searchMessage="No hay habilidades técnicas que coincidan con la búsqueda"
                    />
                  ) : (
                    <>
                      <Card className="rounded-2xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-full border-collapse">
                              <thead className="bg-[#EEF5F9] text-left text-xs uppercase text-[#003A6C]">
                                <tr>
                                  <th className="px-4 py-3 font-semibold">Habilidad</th>
                                  <th className="px-4 py-3 font-semibold">Nivel</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#D9EAF4]">
                                {technicalPagination.items.map((skill) => (
                                  <tr key={skill.id} className="transition hover:bg-white">
                                    <td className="px-4 py-2">
                                      <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
                                          <Code2 className="size-5" />
                                        </div>
                                        <div>
                                          <p className="font-medium text-[#003A6C]">{skill.name}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-[#355468]">
                                      <SkillLevelBadge level={skill.level} />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      <ExperiencePagination
                        currentPage={technicalPagination.currentPage}
                        totalPages={technicalPagination.totalPages}
                        startIndex={technicalPagination.startIndex}
                        endIndex={technicalPagination.endIndex}
                        totalItems={filteredTechnicalSkills.length}
                        onPageChange={technicalPagination.goToPage}
                      />
                    </>
                  )}
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[#003A6C]">
                    <Lightbulb className="size-5" />
                    <h2 className="text-xl sm:text-2xl">Habilidades Blandas</h2>
                  </div>

                  {filteredSoftSkills.length === 0 ? (
                    <SkillsEmptyState
                      searchQuery={searchQuery}
                      emptyMessage="No hay habilidades blandas registradas"
                      searchMessage="No hay habilidades blandas que coincidan con la búsqueda"
                    />
                  ) : (
                    <>
                      <Card className="rounded-2xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-full border-collapse">
                              <thead className="bg-[#EEF5F9] text-left text-xs uppercase text-[#003A6C]">
                                <tr>
                                  <th className="px-4 py-3 font-semibold">Habilidad</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#D9EAF4]">
                                {softPagination.items.map((skill) => (
                                  <tr key={skill.id} className="transition hover:bg-white">
                                    <td className="px-4 py-2">
                                      <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C]">
                                          <Lightbulb className="size-5" />
                                        </div>
                                        <div>
                                          <p className="font-medium text-[#003A6C]">{skill.name}</p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      <ExperiencePagination
                        currentPage={softPagination.currentPage}
                        totalPages={softPagination.totalPages}
                        startIndex={softPagination.startIndex}
                        endIndex={softPagination.endIndex}
                        totalItems={filteredSoftSkills.length}
                        onPageChange={softPagination.goToPage}
                      />
                    </>
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </div>
      <ConfirmationModal
         isOpen={!!pageError}
         title="Error"
          message={pageError}
          buttonText="Cerrar"
          onClose={() => setPageError('')}/>
      <Footer />
    </div>
  );
};

export default ViewSkillsPage;