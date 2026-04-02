import { dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';

const locales = {
  'en-US': enUS,
};

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // start on Monday
  getDay,
  locales,
});

/**
 * Transforms a list of MongoDB Class documents into react-big-calendar event objects
 * @param {Array} classes - List of class objects from the backend
 * @param {Function} onEdit - Callback for editing an event
 * @param {Function} onDelete - Callback for deleting an event
 * @returns {Array} - Formatted events for the calendar
 */
export const transformClassesToEvents = (classes, onEdit, onDelete) => {
  return classes.map(cls => {
    const dateString = cls.schedule?.date;
    const startString = cls.schedule?.startTime;
    const endString = cls.schedule?.endTime;
    
    let start = new Date();
    let end = new Date();
    
    if (dateString && startString && endString) {
        // Use full date strings to avoid timezone issues with localizer
        start = new Date(`${dateString}T${startString}:00`);
        end = new Date(`${dateString}T${endString}:00`);
    }

    return {
      id: cls._id,
      title: cls.course_id?.course_code || 'Class',
      start,
      end,
      resource: {
        ...cls,
        onEdit: () => onEdit && onEdit(cls),
        onDelete: () => onDelete && onDelete(cls._id)
      }
    };
  });
};
