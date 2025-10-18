import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [serverAddress, setServerAddress] = useState('mc.hypixel.net');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const checkServerStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.mcsrvstat.us/3/${serverAddress}`);
      const data = await response.json();
      setServerStatus(data);
      setIsOnline(data.online || false);
      
      if (!data.online) {
        toast({
          title: "Сервер оффлайн",
          description: "Не удалось подключиться к серверу",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось проверить статус сервера",
        variant: "destructive"
      });
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, [serverAddress]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverAddress);
    setCopied(true);
    toast({
      title: "Скопировано!",
      description: "Адрес сервера скопирован в буфер обмена",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const onlinePlayers = serverStatus?.players?.online || 0;
  const maxPlayers = serverStatus?.players?.max || 0;
  const version = serverStatus?.version || 'N/A';
  const motd = serverStatus?.motd?.clean?.[0] || 'Minecraft Server';

  const topPlayers = [
    { name: 'Steve_Pro', kills: 1542, level: 89 },
    { name: 'Herobrine', kills: 1399, level: 85 },
    { name: 'CraftMaster', kills: 1287, level: 82 },
    { name: 'DiamondHunter', kills: 1156, level: 78 },
  ];

  const stats = [
    { label: 'Игроки онлайн', value: isOnline ? `${onlinePlayers}/${maxPlayers}` : 'Оффлайн', icon: 'Users' },
    { label: 'Статус', value: isOnline ? 'Онлайн' : 'Оффлайн', icon: 'Activity' },
    { label: 'Протокол', value: serverStatus?.protocol?.name || 'N/A', icon: 'Wifi' },
    { label: 'Версия', value: version, icon: 'Package' },
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
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Адрес сервера</p>
              
              {isEditing ? (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Input
                    value={serverAddress}
                    onChange={(e) => setServerAddress(e.target.value)}
                    className="text-2xl font-bold text-primary text-center bg-background/50 border-2 border-primary/50 neon-border max-w-md"
                    placeholder="mc.yourserver.net"
                  />
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      checkServerStatus();
                    }}
                    className="neon-border bg-primary/20 hover:bg-primary/40 text-primary font-bold uppercase tracking-wider transition-all"
                    size="lg"
                  >
                    <Icon name="Check" className="mr-2" size={20} />
                    Готово
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4 flex-wrap mb-4">
                  <code className="text-3xl md:text-4xl font-bold text-primary neon-glow select-all">
                    {serverAddress}
                  </code>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button
                  onClick={copyToClipboard}
                  className="neon-border-purple bg-secondary/20 hover:bg-secondary/40 text-secondary-foreground font-bold uppercase tracking-wider transition-all"
                  size="lg"
                >
                  <Icon name={copied ? "Check" : "Copy"} className="mr-2" size={20} />
                  {copied ? 'Скопировано!' : 'Копировать'}
                </Button>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="neon-border bg-primary/20 hover:bg-primary/40 text-primary font-bold uppercase tracking-wider transition-all"
                    size="lg"
                    variant="outline"
                  >
                    <Icon name="Edit" className="mr-2" size={20} />
                    Изменить
                  </Button>
                )}
                <Button
                  onClick={checkServerStatus}
                  disabled={isLoading}
                  className="neon-border-pink bg-accent/20 hover:bg-accent/40 text-accent font-bold uppercase tracking-wider transition-all"
                  size="lg"
                  variant="outline"
                >
                  <Icon name={isLoading ? "Loader2" : "RefreshCw"} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} size={20} />
                  Обновить
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
            <div className={`w-3 h-3 rounded-full animate-pulse-neon ${isOnline ? 'bg-primary' : 'bg-destructive'}`} />
            <p className="text-sm uppercase tracking-wider">
              Сервер {isOnline ? 'онлайн' : 'оффлайн'}
            </p>
          </div>
          {motd && isOnline && (
            <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto">{motd}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;