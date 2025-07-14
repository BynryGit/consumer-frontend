import * as Icons from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../../../core/context/NavigationContext';

interface bentomenuProps {
  open: boolean;
  onClose: () => void;
}

export const bentomenu: React.FC<bentomenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { bentoMenuItems, setCurrentModule } = useNavigation();

  const handleModuleClick = (module: { name: string; link: string; module: string }) => {
    // Update module using the navigation context (this will handle both React Query and localStorage)
    setCurrentModule(module.module as any);
    navigate(module.link);
    onClose();
  };

  const getLucideIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName];
    return LucideIcon ? <LucideIcon className="w-7 h-7 mb-2 text-blue-600" /> : null;
  };

  return (
    <div
      className={`fixed left-0 top-0 w-full z-[9999] transition-transform duration-300 bg-white shadow-lg border-b
        ${open ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <span className="text-xl font-bold">SMART360</span>
        <button
          className="text-2xl text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close menu"
        >
          &times;
        </button>
      </div>
      <div className="p-8 pt-6 h-[27rem] overflow-y-scroll">
        <div className="grid grid-cols-3 gap-4">
          {bentoMenuItems.map((item) => (
            <div
              key={item.name}
              className="flex flex-row items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => handleModuleClick(item)}
            >
              <div className="mr-4 flex-shrink-0 flex items-center justify-center">
                {getLucideIcon(item.lucideIcon)}
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-medium">{item.name}</h4>
                <span className="text-base text-gray-700">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};