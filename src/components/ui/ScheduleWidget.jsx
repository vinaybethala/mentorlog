import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader } from './Card';
import { Calendar } from 'lucide-react';

export const ScheduleWidget = ({ userRole, userId, userClass }) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const filters = userRole === 'tutor' ? { tutorId: userId } : { class: userClass };
      const data = await api.getSchedules(filters);
      setSchedules(data);
    };
    if (userId || userClass) fetchSchedules();
  }, [userRole, userId, userClass]);

  return (
    <Card className="schedule-widget">
      <CardHeader title="Upcoming Schedule" subtitle="Your weekly classes" />
      <CardContent>
        {schedules.length === 0 ? (
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>No upcoming sessions scheduled.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {schedules.map(sch => (
              <div key={sch.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <Calendar size={20} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{sch.subject} ({sch.class})</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {sch.dayOfWeek} at {sch.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
