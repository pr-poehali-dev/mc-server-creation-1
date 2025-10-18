import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const serverAddress = 'mc.yourserver.net';
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverAddress);
    setCopied(true);
    toast({
      title: "Скопировано!",
      description: "Адрес сервера скопирован в буфер обмена",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const onlinePlayers = 127;
  const maxPlayers = 500;
  const serverUptime = '99.9%';

  const topPlayers = [
    { name: 'Steve_Pro', kills: 1542, level: 89 },
    { name: 'Herobrine', kills: 1399, level: 85 },
    { name: 'CraftMaster', kills: 1287, level: 82 },
    { name: 'DiamondHunter', kills: 1156, level: 78 },
  ];

  const stats = [
    { label: 'Игроки онлайн', value: `${onlinePlayers}/${maxPlayers}`, icon: 'Users' },
    { label: 'Uptime', value: serverUptime, icon: 'Activity' },
    { label: 'Режим игры', value: 'Survival', icon: 'Swords' },
    { label: 'Версия', value: '1.20.4', icon: 'Package' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-neon" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-float">
          <h1 className="text-6xl md:text-8xl font-black mb-4 neon-glow text-primary uppercase tracking-wider">
            MINECRAFT
          </h1>
          <p className="text-2xl md:text-3xl text-foreground/80 font-light tracking-wide">
            Присоединяйся к легенде
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mb-12 bg-card/50 backdrop-blur-sm border-2 border-primary/30 neon-border">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Адрес сервера</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <code className="text-3xl md:text-4xl font-bold text-primary neon-glow select-all">
                  {serverAddress}
                </code>
                <Button
                  onClick={copyToClipboard}
                  className="neon-border-purple bg-secondary/20 hover:bg-secondary/40 text-secondary-foreground font-bold uppercase tracking-wider transition-all"
                  size="lg"
                >
                  <Icon name={copied ? "Check" : "Copy"} className="mr-2" size={20} />
                  {copied ? 'Скопировано!' : 'Копировать'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-secondary neon-glow uppercase tracking-wider">
            Статистика сервера
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="bg-card/50 backdrop-blur-sm border-2 border-secondary/30 neon-border-purple hover:scale-105 transition-transform duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-secondary/20 rounded-lg neon-border-purple">
                      <Icon name={stat.icon as any} className="text-secondary" size={32} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-2 border-accent/30 neon-border-pink">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6 text-accent neon-glow uppercase tracking-wider">
                <Icon name="Trophy" className="inline mr-2" size={28} />
                Топ игроков
              </h3>
              <div className="space-y-4">
                {topPlayers.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-accent/20 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-accent/20 rounded-lg neon-border-pink">
                        <span className="text-2xl font-bold text-accent">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg text-foreground">{player.name}</p>
                        <p className="text-sm text-muted-foreground">Уровень {player.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground uppercase tracking-wide">Убийств</p>
                      <p className="text-2xl font-bold text-accent">{player.kills}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse-neon" />
            <p className="text-sm uppercase tracking-wider">Сервер онлайн</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
