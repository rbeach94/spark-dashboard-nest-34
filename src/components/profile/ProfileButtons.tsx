
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface ProfileButtonsProps {
  buttons: Tables<"profile_buttons">[];
  buttonColor: string;
  buttonTextColor: string;
  onDelete: (buttonId: string) => void;
  onButtonClick: (button: Tables<"profile_buttons">) => void;
  onReorder?: (buttons: Tables<"profile_buttons">[]) => void;
}

interface SortableButtonProps {
  button: Tables<"profile_buttons">;
  buttonColor: string;
  buttonTextColor: string;
  onDelete: (buttonId: string) => void;
  onButtonClick: (button: Tables<"profile_buttons">) => void;
}

const SortableButton = ({ button, buttonColor, buttonTextColor, onDelete, onButtonClick }: SortableButtonProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: button.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked:', button.id, button.label);
    try {
      onButtonClick(button);
    } catch (error) {
      console.error('Error handling button click:', error);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Deleting button:', button.id, button.label);
    onDelete(button.id);
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 items-center">
      <button {...attributes} {...listeners} className="cursor-grab touch-manipulation">
        <GripVertical className="h-5 w-5 text-gray-500" />
      </button>
      <Button
        className="flex-1 hover:opacity-90 touch-manipulation"
        style={{ 
          backgroundColor: buttonColor,
          color: buttonTextColor
        }}
        onClick={handleButtonClick}
        type="button"
      >
        {button.label}
      </Button>
      <Button
        variant="destructive"
        onClick={handleDeleteClick}
        type="button"
        className="touch-manipulation"
      >
        Delete
      </Button>
    </div>
  );
};

export const ProfileButtons = ({ 
  buttons, 
  buttonColor, 
  buttonTextColor, 
  onDelete, 
  onButtonClick,
  onReorder 
}: ProfileButtonsProps) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = buttons.findIndex((b) => b.id === active.id);
      const newIndex = buttons.findIndex((b) => b.id === over.id);
      
      const newButtons = [...buttons];
      const [movedButton] = newButtons.splice(oldIndex, 1);
      newButtons.splice(newIndex, 0, movedButton);
      
      onReorder?.(newButtons);
    }
  };

  return (
    <div className="space-y-4">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={buttons.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {buttons?.map((button) => (
            <SortableButton
              key={button.id}
              button={button}
              buttonColor={buttonColor}
              buttonTextColor={buttonTextColor}
              onDelete={onDelete}
              onButtonClick={onButtonClick}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
