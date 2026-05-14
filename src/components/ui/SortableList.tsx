import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DotsSixVertical } from '@phosphor-icons/react';

interface SortableItem { id: string; }

interface Props<T extends SortableItem> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onReorder: (next: T[]) => void;
  ariaLabel?: string;
}

export function SortableList<T extends SortableItem>({ items, renderItem, onReorder, ariaLabel }: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((it) => it.id === active.id);
    const newIdx = items.findIndex((it) => it.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    onReorder(arrayMove(items, oldIdx, newIdx));
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((it) => it.id)} strategy={verticalListSortingStrategy}>
        <ul aria-label={ariaLabel} className="space-y-1.5">
          {items.map((it, i) => <Row key={it.id} id={it.id}>{renderItem(it, i)}</Row>)}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function Row({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return (
    <li ref={setNodeRef} style={style} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-r-2 px-2 py-1.5">
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-fg-3 hover:text-fg-1 touch-none px-0.5 py-1"
        aria-label="Sürükle"
      >
        <DotsSixVertical size={14} weight="bold" />
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </li>
  );
}
