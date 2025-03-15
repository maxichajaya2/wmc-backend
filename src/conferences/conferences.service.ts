import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConferenceDto } from './dto/create-conference.dto';
import { UpdateConferenceDto } from './dto/update-conference.dto';
import { ConferencesRepository } from '../domain/repositories/conferences.repository';
import { RoomsRepository } from '../domain/repositories/rooms.repository';
import { Conference } from '../domain/entities/conference.entity';
import { DateTime } from "luxon";
import { SpeakersRepository } from '../domain/repositories/speakers.repository';
import { In } from 'typeorm';
import { CountriesService } from '../common/services/countries.service';
import { ConferenceSpeakersRepository } from '../domain/repositories/conference-speakers.repository';
import { SpeakerTypesRepository } from '../domain/repositories/speaker-types.repository';

@Injectable()
export class ConferencesService {
  constructor(
    private readonly conferenceRepository: ConferencesRepository,
    private readonly speakersRepository: SpeakersRepository,
    private readonly speakerConferenceRepository: ConferenceSpeakersRepository,
    private readonly roomRepository: RoomsRepository,
    private readonly countriesService: CountriesService,
    private readonly speakerTypeRepository: SpeakerTypesRepository
  ) { }

  async create(createConferenceDto: CreateConferenceDto) {
    const { roomId, startDate, endDate, speakers: speakersDto } = createConferenceDto
    const room = await this.roomRepository.repository.findOne({
      where: { id: roomId }
    })
    if (!room) {
      throw new NotFoundException('Room not found')
    }

    const speakerIds = speakersDto?.map(s => s.id);
    let speakers = [];

    if (speakerIds && speakerIds.length > 0) {
      speakers = await this.speakersRepository.repository.find({
        where: {
          id: In(speakerIds)
        }
      });
    }
    const conference: Conference = {
      ...createConferenceDto,
      room,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdAt: new Date(),
    }
    const newConference = await this.conferenceRepository.repository.save(conference);
    if (speakers.length > 0) {
      for (const spDto of speakersDto) {
        const speakerType = await this.speakerTypeRepository.repository.findOne({
          where: { id: spDto.speakerTypeId }
        });
        await this.speakerConferenceRepository.repository.save({
          conference: newConference,
          speaker: spDto,
          speakerType
        });
      }
    }

    return this.findOne(newConference.id);
  }

  private toJson(c: Conference) {
    console.log('holi');
    return {
      ...c,
      conferenceSpeakers: c.conferenceSpeakers.map(cs => {
        const country = cs.speaker?.countryCode ? this.countriesService.getCountry(cs.speaker.countryCode) : null;
        cs.speaker.country = country;
        return cs;
      })
    }
  }

  async findAll({
    mode = 'public',
    speakerId
  } = { mode: 'public', speakerId: undefined }): Promise<any> {
    if (speakerId) {
      const cf = await this.conferenceRepository.repository.find({
        where: {
          conferenceSpeakers: {
            speakerId: speakerId
          }
        },
        relations: ['speakers']
      });
      return cf.map(c => this.toJson(c));
    }
    const where = {};
    if (mode === 'public') {
      where['isActive'] = true;
    }
    let conferences = await this.conferenceRepository.repository.find();
    conferences = conferences.map(c => this.toJson(c));
    console.log({
      conferences: JSON.stringify(conferences.map(c => ({
        id: c.id,
        name: c.nameEs,
        startDate: c.startDate,
        endDate: c.endDate,
        room: c.room?.nameEs
      })), null, 2)
    });
    if (mode === 'public') {
      conferences.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      const response: {
        [key: string]: (Conference & { startDatePeru: string, endDatePeru: string })[]
      } = {};
      conferences.forEach((conference) => {
        const startDate = conference.startDate.toISOString();
        const endDate = conference.endDate.toISOString();
        const startPeruDate = DateTime.fromISO(startDate).setZone("America/Lima");
        const endPeruDate = DateTime.fromISO(endDate).setZone("America/Lima");
        const startDateWithoutHour = startPeruDate.toISO().split('T')[0];
        if (!response[startDateWithoutHour]) {
          response[startDateWithoutHour] = [];
        }
        response[startDateWithoutHour].push({
          ...conference,
          startDatePeru: startPeruDate.toISO(),
          endDatePeru: endPeruDate.toISO()
        });
      });

      const dates = Object.keys(response);
      const response2 = {};
      dates.forEach((date) => {
        response2[date] = {};
      });

      console.log({ response2 });

      Object.entries(response).forEach(([dayDate, conferencesList]) => {
        console.log('Analizando día: ', dayDate);
        for (const conference of conferencesList) {
          const { nameEs, roomId, startDatePeru } = conference;
          console.log('Analizando conferencia: ', nameEs);
          console.log({ roomId });
          if (conference.room === null) {
            console.log('No se encontró la sala, saltando conferencia');
            return;
          }
          const horaInicio = startDatePeru.substring(11, 16); // HH:mm
          console.log({ horaInicio });

          // Buscar la clave más cercana que incluya esta fecha en su rango
          const roomName = conference.room.nameEn + '&&&' + conference.room.nameEs;
          console.log({ roomName })
          const claveExistente = Object.keys(response2[dayDate]).find((hora) => {
            console.log({ dayDate, hora, roomName });
            const roomKeys = Object.keys(response2[dayDate][hora]);
            const conferencesInHour = roomKeys.flatMap(roomKey => response2[dayDate][hora][roomKey]);
            console.log({ conferencesInHour });
            return conferencesInHour.some(conferenceInHour => {
              const ultimaFechaPeru = conferenceInHour.endDatePeru;
              console.log({ startDatePeru, ultimaFechaPeru });
              return startDatePeru <= ultimaFechaPeru; // Si el startDate está dentro del rango, usar esa clave
            }
            );
          });


          //   const ultimaFechaPeru = conferencesInHour[conferencesInHour.length - 1].endDatePeru;
          //   console.log({ startDatePeru, ultimaFechaPeru });
          //   return startDatePeru <= ultimaFechaPeru; // Si el startDate está dentro del rango, usar esa clave
          // });
          console.log({ claveExistente });
          if (claveExistente) {
            if (!response2[dayDate][claveExistente][roomName]) {
              response2[dayDate][claveExistente][roomName] = [];
            }
            response2[dayDate][claveExistente][roomName].push(conference);
          } else {
            if (!response2[dayDate][horaInicio]) {
              response2[dayDate][horaInicio] = {};
            }
            const conferencesInRoom = response2[dayDate][horaInicio][roomName];
            const existsElements = conferencesInRoom && conferencesInRoom.length > 0;
            if (existsElements) {
              response2[dayDate][horaInicio][roomName].push(conference);
            } else {
              response2[dayDate][horaInicio][roomName] = [conference];
            }
          }
          console.log({ response2: JSON.stringify(this.shortResponse2(response2), null, 2) });
        }
      });
      return response2;
    }
    return conferences;
  }

  shortResponse2(response2) {
    const response = {};
    Object.entries(response2).forEach(([dayDate, hours]) => {
      response[dayDate] = {};
      Object.entries(hours).forEach(([hour, rooms]) => {
        response[dayDate][hour] = {};
        Object.entries(rooms).forEach(([room, conferences]) => {
          response[dayDate][hour][room] = (conferences as any).map(c => ({
            id: c.id,
            nameEs: c.nameEs,
            startDatePeru: c.startDatePeru,
            endDatePeru: c.endDatePeru
          }));
        });
      });
    });
    return response;
  }

  async findOne(id: number, { onlyActive = false } = {}) {
    const where = { id };
    if (onlyActive) {
      where['isActive'] = true;
    }
    const conference = await this.conferenceRepository.repository.findOne({
      where,
      relations: ['room']
    })
    if (!conference) {
      throw new NotFoundException('Conference not found')
    }
    return this.toJson(conference) as Conference;
  }

  async update(id: number, updateConferenceDto: UpdateConferenceDto) {
    const conference = await this.findOne(id);
    const { roomId, speakers: speakersDto } = updateConferenceDto;
    if (roomId && roomId !== conference.roomId) {
      const room = await this.roomRepository.repository.findOne({
        where: { id: roomId }
      })
      if (!room) {
        throw new NotFoundException('Room not found')
      }
      conference.room = room;
    }
    if (!conference) {
      throw new NotFoundException('Conference not found')
    }
    delete updateConferenceDto.speakers;
    const updatedConference = await this.conferenceRepository.repository.save({
      ...conference,
      ...updateConferenceDto
    })
    const speakerIds = speakersDto?.map(s => s.id);
    console.log({ speakerIds });
    await this.speakerConferenceRepository.repository.delete({
      conferenceId: conference.id
    });
    const speakers = await this.speakersRepository.repository.find({
      where: {
        id: In(speakerIds)
      }
    });
    for (const sp of speakersDto) {
      const speakerType = await this.speakerTypeRepository.repository.findOne({
        where: { id: sp.speakerTypeId }
      });
      await this.speakerConferenceRepository.repository.save({
        conference: updatedConference,
        speaker: speakers.find(s => s.id === sp.id),
        speakerType
      });
    }
    return this.findOne(id);
  }

  remove(id: number) {
    this.conferenceRepository.repository.softDelete({ id });
    return null;
  }
}
