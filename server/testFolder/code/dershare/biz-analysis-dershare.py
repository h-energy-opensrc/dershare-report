import calendar
import csv
import datetime
import json
import numpy
import sys
from enum import Enum


class UsageLoad(Enum):
    LIGHT = 1
    NORMAL = 2
    HEAVY = 3


class Season(Enum):
    SUMMER = 1
    SPRING_FALL = 2
    WINTER = 3


class UsageLoadPeriod:
    def __init__(self, start_hour, end_hour):
        self._start = datetime.timedelta(hours=start_hour)
        self._end = datetime.timedelta(hours=end_hour)

    def is_in(self, delta):
        return self._start < delta <= self._end

    def duration(self):
        return self._end - self._start


class UsageLoadPeriods:
    def __init__(self, periods):
        self._periods = tuple(UsageLoadPeriod(
            period[0], period[1]) for period in periods)

    def is_in(self, datetime_):
        """ 00:00:00 사용량은 이전날 사용량이기 때문에 delta가 0이면 24시간으로 수정한다. """
        midnight = datetime.datetime(
            datetime_.year, datetime_.month, datetime_.day)
        delta = datetime_ - midnight
        if delta == datetime.timedelta():
            delta = datetime.timedelta(hours=24)
        for period in self._periods:
            if period.is_in(delta):
                return True
        return False

    def duration(self):
        duration = datetime.timedelta()
        for period in self._periods:
            duration += period.duration()
        return duration


class Utils:
    _USAGE_LOAD_PERIODS = {
        Season.SUMMER: {
            UsageLoad.LIGHT: UsageLoadPeriods(((0, 9), (23, 24))),
            UsageLoad.NORMAL: UsageLoadPeriods(((9, 10), (12, 13), (17, 23))),
            UsageLoad.HEAVY: UsageLoadPeriods(((10, 12), (13, 17)))
        },
        Season.SPRING_FALL: {
            UsageLoad.LIGHT: UsageLoadPeriods(((0, 9), (23, 24))),
            UsageLoad.NORMAL: UsageLoadPeriods(((9, 10), (12, 13), (17, 23))),
            UsageLoad.HEAVY: UsageLoadPeriods(((10, 12), (13, 17)))
        },
        Season.WINTER: {
            UsageLoad.LIGHT: UsageLoadPeriods(((0, 9), (23, 24))),
            UsageLoad.NORMAL: UsageLoadPeriods(((9, 10), (12, 17), (20, 22))),
            UsageLoad.HEAVY: UsageLoadPeriods(((10, 12), (17, 20), (22, 23)))
        }
    }
    _HOLIDAYS = {
        datetime.date(2016, 10, 3),
        datetime.date(2017, 1, 1),
        datetime.date(2017, 1, 27),
        datetime.date(2017, 1, 28),
        datetime.date(2017, 1, 30),
        datetime.date(2017, 3, 1),
        datetime.date(2017, 5, 3),
        datetime.date(2017, 5, 5),
        datetime.date(2017, 5, 9),
        datetime.date(2017, 6, 6),
        datetime.date(2017, 8, 15),
        datetime.date(2017, 10, 3),
        datetime.date(2017, 10, 4),
        datetime.date(2017, 10, 5),
        datetime.date(2017, 10, 6),
        datetime.date(2017, 10, 9),
        datetime.date(2017, 12, 25),
        datetime.date(2018, 1, 1),
        datetime.date(2018, 2, 4),
        datetime.date(2018, 2, 16),
        datetime.date(2018, 2, 17),
        datetime.date(2018, 3, 1),
        datetime.date(2018, 5, 7),
        datetime.date(2018, 5, 22),
        datetime.date(2018, 6, 6),
        datetime.date(2018, 8, 15),
        datetime.date(2018, 9, 24),
        datetime.date(2018, 9, 25),
        datetime.date(2018, 9, 26),
        datetime.date(2018, 10, 3),
        datetime.date(2018, 10, 9),
        datetime.date(2018, 12, 25)
    }

    @classmethod
    def measure_date(cls, datetime_):
        """ 00시 00분은 사용량은 이전날 사용량이다. """
        if datetime_.time().hour == 0 and datetime_.time().minute == 0:
            return (datetime_ - datetime.timedelta(days=1)).date()
        else:
            return datetime_.date()

    @classmethod
    def season(cls, month):
        if month in (6, 7, 8):
            return Season.SUMMER
        elif month in (3, 4, 5, 9, 10):
            return Season.SPRING_FALL
        else:
            return Season.WINTER

    @classmethod
    def is_holiday(cls, date):
        return date in cls._HOLIDAYS

    @classmethod
    def is_weekday(cls, date):
        return not (Utils.is_holiday(date)
                    or date.weekday() == 6 or date.weekday() == 5)

    @classmethod
    def is_in(cls, datetime_, usage_load):
        measure_date = cls.measure_date(datetime_)
        season = Utils.season(measure_date.month)
        return cls._USAGE_LOAD_PERIODS[season][usage_load].is_in(datetime_)

    @classmethod
    def usage_load(cls, datetime_):
        measure_date = cls.measure_date(datetime_)
        if (Utils.is_holiday(measure_date) or datetime_.weekday() == 6):
            return UsageLoad.LIGHT
        elif measure_date.weekday() == 5:
            if Utils.is_in(datetime_, UsageLoad.LIGHT):
                return UsageLoad.LIGHT
            else:
                return UsageLoad.NORMAL
        else:
            if Utils.is_in(datetime_, UsageLoad.LIGHT):
                return UsageLoad.LIGHT
            elif Utils.is_in(datetime_, UsageLoad.NORMAL):
                return UsageLoad.NORMAL
            else:
                return UsageLoad.HEAVY

    @classmethod
    def day_start_time(cls, date):
        return datetime.datetime(date.year, date.month, date.day, 0, 15)

    @classmethod
    def next_month(cls, date):
        return (date
                + datetime.timedelta(
                    days=calendar.monthrange(date.year, date.month)[1])
                )


class Charge:
    def __init__(self, cfg):
        self.demand = cfg['demand']
        energy = cfg['energy']
        summer_energy = energy['summer']
        spring_energy = energy['spring_fall']
        winter_energy = energy['winter']
        self.energy = {
            Season.SUMMER: {
                UsageLoad.LIGHT: summer_energy['light'],
                UsageLoad.NORMAL: summer_energy['normal'],
                UsageLoad.HEAVY: summer_energy['heavy']
            },
            Season.SPRING_FALL: {
                UsageLoad.LIGHT: spring_energy['light'],
                UsageLoad.NORMAL: spring_energy['normal'],
                UsageLoad.HEAVY: spring_energy['heavy']
            },
            Season.WINTER: {
                UsageLoad.LIGHT: winter_energy['light'],
                UsageLoad.NORMAL: winter_energy['normal'],
                UsageLoad.HEAVY: winter_energy['heavy']
            }
        }

    def __str__(self):
        format = ('{:5,d}\n{:5.1f}, {:5.1f}, {:5.1f}\n'
                  '{:5.1f}, {:5.1f}, {:5.1f}\n{:5.1f}, {:5.1f}, {:5.1f}')
        return format.format(self.demand,
                             self.energy[Season.SUMMER][UsageLoad.LIGHT],
                             self.energy[Season.SUMMER][UsageLoad.NORMAL],
                             self.energy[Season.SUMMER][UsageLoad.HEAVY],
                             self.energy[Season.SPRING_FALL][UsageLoad.LIGHT],
                             self.energy[Season.SPRING_FALL][UsageLoad.NORMAL],
                             self.energy[Season.SPRING_FALL][UsageLoad.HEAVY],
                             self.energy[Season.WINTER][UsageLoad.LIGHT],
                             self.energy[Season.WINTER][UsageLoad.NORMAL],
                             self.energy[Season.WINTER][UsageLoad.HEAVY])


class Bill:
    def __init__(self):
        self.demand_price = 0.0
        self.energy_price = 0.0
        self.total_price = 0.0
        self.VAT = 0.0
        self.power_industry_fund = 0.0
        self.payment = 0.0

    def __str__(self):
        format = ('기본요금 {:11,.2f}, 사용량요금 {:13,.2f},'
                  ' 요금합계 {:13,.2f}, 부가세 {:12,.2f}, '
                  ' 전력산업기반기금 {:12,.2f}, 청구금액 {:13,.2f}')
        return format.format(self.demand_price,
                             self.energy_price,
                             self.total_price,
                             self.VAT,
                             self.power_industry_fund,
                             self.payment)

    def calculate(self, month, charge, peak_demand, usages):
        season = Utils.season(month)
        seasonal_charge = charge.energy[season]
        self.demand_price = peak_demand * charge.demand
        self.energy_price = 0.0
        for usage_load in UsageLoad:
            self.energy_price += (usages[usage_load]
                                  * seasonal_charge[usage_load])
        self.total_price = self.demand_price + self.energy_price
        self.VAT = self.total_price * 0.1
        self.power_industry_fund = self.total_price * 0.037
        self.payment = self.total_price + self.VAT + self.power_industry_fund


class MonthlyInfo:
    class Consumption:
        def __init__(self):
            self.usages = {
                UsageLoad.LIGHT: 0.0,
                UsageLoad.NORMAL: 0.0,
                UsageLoad.HEAVY: 0.0
            }
            self.peak_usage = 0.0
            self.peak_demand = 0.0

    class Simulation:
        def __init__(self):
            self.consumption = MonthlyInfo.Consumption()
            self.estimated_peak_cut = 0.0
            self.total_charges = 0.0

    class DailyInfo:
        def __init__(self, weekday):
            self.usages = {
                UsageLoad.LIGHT: 0.0,
                UsageLoad.NORMAL: 0.0,
                UsageLoad.HEAVY: 0.0
            }
            self.weekday = weekday
            self.unit_usages = []
            self.peak_usage = 0.0

    def __init__(self):
        self.year = -1
        self.month = -1
        self.peak_day = None
        self.num_weekdays = 0
        self.daily_infos = {}
        self.measure = self.Consumption()
        self.bill = Bill()
        self.simulation = self.Simulation()

    def __str__(self):
        monthly_format = (
            '{:02d}, light={:10,.2f}, normal={:10,.2f}, heavy={:10,.2f}, '
            'total={:10,.2f}, num_weekdays={:3}, peak={:6,.2f}, peak_day={}\n')
        result = monthly_format.format(self.month,
                                       self.measure.usages[UsageLoad.LIGHT],
                                       self.measure.usages[UsageLoad.NORMAL],
                                       self.measure.usages[UsageLoad.HEAVY],
                                       self.measure.usages[UsageLoad.LIGHT]
                                       + self.measure.usages[UsageLoad.NORMAL]
                                       + self.measure.usages[UsageLoad.HEAVY],
                                       self.num_weekdays,
                                       self.measure.peak_usage * 4,
                                       self.peak_day)
        daily_format = '    {:02d}: light={:10,.2f}, normal={:10,.2f}({:02d}), heavy={:10,.2f}({:02d}), peak={:6,.2f}\n'
        for day, info in self.daily_infos.items():
            result += daily_format.format(day,
                                          info.usages[UsageLoad.LIGHT],
                                          info.usages[UsageLoad.NORMAL],
                                          len(info.normal_usages),
                                          info.usages[UsageLoad.HEAVY],
                                          len(info.heavy_usages),
                                          info.peak_usage * 4)
        return result

    def add(self, measure):
        usage_load = Utils.usage_load(measure.time)
        self.measure.usages[usage_load] += measure.usage
        measure_date = Utils.measure_date(measure.time)
        if not (Utils.is_holiday(measure_date) or measure_date.weekday() == 6):
            day = measure_date.day
            daily_info = self.daily_infos.get(day)
            if daily_info is None:
                daily_info = self.DailyInfo(measure_date.weekday() != 5)
                self.daily_infos[day] = daily_info

            daily_info.usages[usage_load] += measure.usage
            daily_info.unit_usages.append((usage_load, measure.usage))

            if usage_load != UsageLoad.LIGHT:
                if daily_info.peak_usage < measure.usage:
                    daily_info.peak_usage = measure.usage
                    if self.measure.peak_usage < measure.usage:
                        self.measure.peak_usage = measure.usage
                        self.peak_day = day

    def update_bill(self, annual_peak, charge):
        self.peak_demand = annual_peak * 4
        self.bill.calculate(self.month, charge,
                            self.peak_demand, self.measure.usages)


class Simulator:
    class PeakInfo:
        def __init__(self):
            self.usage = 0.0
            self.month = None
            self.day = None
            self.modified_unit_usages = []

    class _Measure:
        def __init__(self, measure):
            self.time = datetime.datetime.strptime(
                measure['time'], '%Y-%m-%d %H:%M:%S')
            self.usage = float(measure['usage'])

        def __str__(self):
            return self.time.strftime('%Y-%m-%d %H:%M:%S ') + str(self.usage)

    def __init__(self):
        self._measures = []
        self._cfg = None
        self._monthly_infos = [None] * 12
        self._annual_peak_usage = 0.0
        self._seasonal_peaks = {
            Season.SPRING_FALL: self.PeakInfo(),
            Season.SUMMER: self.PeakInfo(),
            Season.WINTER: self.PeakInfo(),
        }
        if len(sys.argv) > 1:
            self._cfg = json.loads(sys.argv[1])
            measure_csv_name = self._cfg.get('measure_csv')
            if measure_csv_name is not None:
                with open(measure_csv_name, 'r') as measure_csv_file:
                    measure_reader = csv.DictReader(measure_csv_file)
                    self._measures = [self._Measure(
                        measure) for measure in measure_reader]

            self._start_month = datetime.datetime.strptime(
                self._cfg['start_month'], '%Y-%m').date()
            measure_end_date = self._measures[-1].time.date()
            end_month = measure_end_date.month - 1
            if end_month == 12:
                self._measure_start_date = datetime.datetime(
                    measure_end_date.year, 1, 1)
            else:
                self._measure_start_date = datetime.datetime(
                    measure_end_date.year - 1, end_month + 1, 1)

            self._charge = Charge(self._cfg['charge'])

    def _addMonthlyInfo(self, monthly_info, start_date, end_date):
        date = start_date
        while date < end_date:
            if Utils.is_weekday(date):
                monthly_info.num_weekdays += 1
            date += datetime.timedelta(days=1)
        monthly_info.year = start_date.year
        monthly_info.month = start_date.month if start_date.day == 1 else end_date.month
        self._monthly_infos[monthly_info.month - 1] = monthly_info

    def _monthly_info_index(self, sim_month):
        return (sim_month + self._start_month.month) % 12 - 1

    def _simulate_ess(self, monthly_info, battery, pcs_rate):
        target_peak = self._annual_peak_usage - pcs_rate
        season = Utils.season(monthly_info.month)
        usage_load_periods = Utils._USAGE_LOAD_PERIODS[season]
        num_charge_units = usage_load_periods[UsageLoad.LIGHT].duration(
        ) / datetime.timedelta(minutes=15)
        num_discharge_units = usage_load_periods[UsageLoad.HEAVY].duration(
        ) / datetime.timedelta(minutes=15)
        total_charges = min(pcs_rate, battery /
                            num_charge_units) * num_charge_units
        total_discharges = min(pcs_rate, battery /
                               num_discharge_units) * num_discharge_units
        battery_usage = min(total_charges, total_discharges)
        simulation = MonthlyInfo.Simulation()
        for usage_load in UsageLoad:
            simulation.consumption.usages[usage_load] = monthly_info.measure.usages[usage_load]

        charging_rate = battery_usage / num_charge_units

        # 충반전 시뮬레이션
        monthly_heavy_discharges = 0.0
        for day, daily_info in monthly_info.daily_infos.items():
            remain_battery = battery_usage
            peak_cut_discharges = 0.0
            modified_daily_unit_usages = []
            if daily_info.weekday:
                # 평일
                heavy_discharges = 0.0
                normal_discharges = 0.0
                # 충전 및 피크 컷
                for unit_usage in daily_info.unit_usages:
                    if unit_usage[0] == UsageLoad.LIGHT:
                        # 경부하시간대에는 charging_rate로 충전한다.
                        modified_daily_unit_usages.append(
                            [unit_usage[0], unit_usage[1] + charging_rate])
                    else:
                        # 다른 부하 시간대에는 목표하는 피크보다 높으면 목표하는 피크가 될 수 있도록 방전한다.
                        # 단, 배터리 용량이 다 되면 방전하지 않는다.
                        peak_cut = unit_usage[1] - target_peak
                        if peak_cut > 0.0 and remain_battery > 0.0:
                            peak_cut_discharge = min(peak_cut, remain_battery)
                            modified_daily_unit_usages.append(
                                [unit_usage[0], unit_usage[1] - peak_cut_discharge])
                            remain_battery -= peak_cut_discharge
                            peak_cut_discharges += peak_cut_discharge
                            # 최대부하 시간이면 최대부하 시간 방전을 저장한다.
                            if unit_usage[0] == UsageLoad.HEAVY:
                                heavy_discharges += peak_cut_discharge
                                monthly_heavy_discharges += peak_cut_discharge
                            else:
                                normal_discharges += peak_cut_discharge
                        else:
                            # 피크컷이 필요없으면 현재 상태 유지
                            modified_daily_unit_usages.append(list(unit_usage))

                # 최대부하방전
                # 남아 있는 배터리를 최대부하시간에 대해서 균일하게 방전한다
                energy_saving_discharge = remain_battery / num_discharge_units
                for unit_usage in modified_daily_unit_usages:
                    if unit_usage[0] == UsageLoad.HEAVY:
                        unit_usage[1] -= energy_saving_discharge
                heavy_discharges += remain_battery
                monthly_heavy_discharges += remain_battery

                # 일간 시뮬레이션 종합
                simulation.consumption.usages[UsageLoad.LIGHT] += battery_usage
                simulation.consumption.usages[UsageLoad.NORMAL] -= normal_discharges
                simulation.consumption.usages[UsageLoad.HEAVY] -= heavy_discharges
                for unit_usage in modified_daily_unit_usages:
                    if unit_usage[0] != UsageLoad.LIGHT:
                        if simulation.consumption.peak_usage < unit_usage[1]:
                            simulation.consumption.peak_usage = unit_usage[1]
                simulation.total_charges += battery_usage
            else:
                # 토요일은 피크컷을 위한 방전을 하고 그만큼만 충전한다.
                for unit_usage in daily_info.unit_usages:
                    if unit_usage[0] == UsageLoad.NORMAL:
                        # 중간부하 시간대에 피크컷을 수행한다.
                        peak_cut = unit_usage[1] - target_peak
                        if (peak_cut > 0.0) and remain_battery > 0.0:
                            peak_cut_discharge = min(peak_cut, remain_battery)
                            modified_daily_unit_usages.append(
                                [unit_usage[0], unit_usage[1] - peak_cut_discharge])
                            remain_battery -= peak_cut_discharge
                            peak_cut_discharges += peak_cut_discharge
                        else:
                            # 피크컷이 필요없으면 현재 상태 유지
                            modified_daily_unit_usages.append(list(unit_usage))
                    else:
                        # 경부하 시간대에는 일단 유지
                        modified_daily_unit_usages.append(list(unit_usage))

                # 피크컷을 위해 방전한 만큼만 경부하 시간대 균일하게 충전한다.
                if peak_cut_discharges > 0.0:
                    peak_cut_charge = peak_cut_discharges / num_charge_units
                    for unit_usage in modified_daily_unit_usages:
                        if unit_usage[0] == UsageLoad.LIGHT:
                            unit_usage[1] += peak_cut_charge

                # 일간 시뮬레이션 종합
                simulation.consumption.usages[UsageLoad.LIGHT] += peak_cut_discharges
                simulation.consumption.usages[UsageLoad.NORMAL] -= peak_cut_discharges
                for unit_usage in modified_daily_unit_usages:
                    if unit_usage[0] != UsageLoad.LIGHT:
                        if simulation.consumption.peak_usage < unit_usage[1]:
                            simulation.consumption.peak_usage = unit_usage[1]
                simulation.total_charges += peak_cut_discharges

            # 계절별 피크 샘플 저장
            seasonal_peak = self._seasonal_peaks[season]
            if seasonal_peak.day == day and monthly_info.month == seasonal_peak.month:
                seasonal_peak.modified_unit_usages = modified_daily_unit_usages

        simulation.estimated_peak_cut = monthly_heavy_discharges / \
            (monthly_info.num_weekdays * 3)
        monthly_info.simulation = simulation

    def _compare_seasonal_peak(self, season):
        seasonal_peak = self._seasonal_peaks[season]
        for monthly_info in self._monthly_infos:
            if monthly_info.month == seasonal_peak.month:
                before_usages = monthly_info.daily_infos[seasonal_peak.day].unit_usages
                after_usages = seasonal_peak.modified_unit_usages
                usages = []
                time = datetime.datetime(monthly_info.year, monthly_info.month, 1, hour=0, minute=15)
                for before, after in zip(before_usages, after_usages):
                    usages.append({
                        "time": time.strftime('%H:%M:%S'),
                        "before": before[1],
                        "after": after[1]
                    })
                    time += datetime.timedelta(minutes=15)
                return {
                    "date": '{:02d}-{:02d}'.format(monthly_info.month, seasonal_peak.day),
                    "before_peak": seasonal_peak.usage * 4,
                    "after_peak": monthly_info.simulation.consumption.peak_usage * 4,
                    "usages": usages
                }
        return None

    def _simulate(self, result):
        battery = result['battery']
        pcs = result['pcs']

        sim_cfg = self._cfg['simulation']

        # 구축 비용 계산
        construction_cfg = sim_cfg['construction']
        ess_cost = ((construction_cfg['battery'] * battery)
                    + (construction_cfg['pcs'] * pcs)
                    + (construction_cfg['install'] * battery)
                    + (construction_cfg['ems'] * battery))
        manage_cost = ess_cost * \
            construction_cfg['manage'] / (1 - construction_cfg['manage'])
        construction_cost = ess_cost + manage_cost

        life_cycle = sim_cfg['life_cycle'] * 12

        year = self._start_month.year

        ess_share_cfg = sim_cfg['ess_share']
        intense_period = ess_share_cfg['intense_period'] * 12
        intense_share_rate = ess_share_cfg['intense_rate']
        normal_share_rate = ess_share_cfg['normal_rate']

        # 금융 변수. 현재는 월단위 상환만 고려
        finance_cfg = sim_cfg['finance']
        # 차입원금
        principal = construction_cost * finance_cfg['borrow_rate']
        # 투자금
        equity = construction_cost - principal
        # 거치기간
        grace_period = finance_cfg['grace_period'] * 12
        # 원금상환기간
        principal_payment_period = finance_cfg['principal_payment_period'] * 12
        # 원리금상환기간
        payment_period = grace_period + principal_payment_period
        # 이자율
        interest_rate = finance_cfg['interest_rate'] / 12
        # 미상환 원금
        remain_principal = principal

        # 운용변수
        operation_cfg = sim_cfg['operation']
        sga_rate = operation_cfg['sga_rate']
        depreciation_period = operation_cfg['depreciation_period'] * 12
        corp_tex_rate = operation_cfg['corp_tex_rate']

        net_equity_cashes = [-equity]
        cumul_equity_cashes = []
        yearly_net_equity_cash = 0.0
        yearly_cumul_equity_cash = 0.0
        net_project_cashes = [-construction_cost]
        cumul_project_cashes = []
        yearly_net_projct_cash = 0.0
        yearly_cumul_project_cash = 0.0

        simulated_annual_peak_usage = 0.0
        for info in self._monthly_infos:
            self._simulate_ess(info, battery, pcs / 4)
            if simulated_annual_peak_usage < info.simulation.consumption.peak_usage:
                simulated_annual_peak_usage = info.simulation.consumption.peak_usage

        for sim_month in range(life_cycle):
            info = self._monthly_infos[self._monthly_info_index(sim_month)]

            # 요금적용전력 산출
            if sim_month < 12:
                peak_usage = info.simulation.consumption.peak_usage
                for month in range(sim_month):
                    monthly_info = self._monthly_infos[self._monthly_info_index(
                        month)]
                    if monthly_info.month in (1, 2, 7, 8, 9, 12):
                        if peak_usage < monthly_info.simulation.consumption.peak_usage:
                            peak_usage = monthly_info.simulation.consumption.peak_usage
                for month in range(sim_month + 1, 12):
                    monthly_info = self._monthly_infos[self._monthly_info_index(
                        month)]
                    if monthly_info.month in (1, 2, 7, 8, 9, 12):
                        if peak_usage < monthly_info.measure.peak_usage:
                            peak_usage = monthly_info.measure.peak_usage
                peak_demand = peak_usage * 4
            else:
                peak_demand = simulated_annual_peak_usage * 4

            # 기본 요금 계산
            demand_price = peak_demand * self._charge.demand

            # 사용량 요금 계산
            seasonal_charge = self._charge.energy[Utils.season(info.month)]
            energy_price = 0.0
            for usage_load in UsageLoad:
                energy_price += (info.simulation.consumption.usages[usage_load] *
                                 seasonal_charge[usage_load])

            # 요금 할인 계산
            demand_price_discount = 0.0
            energy_price_discount = 0.0
            if year < 2027:
                # 2027년 이전에서 기본요금 할인 적용
                demand_price_discount = info.simulation.estimated_peak_cut * self._charge.demand
                if year < 2021:
                    # 2021년 이전에는 기본요금할인 3배 경부하 충전 할인 적용
                    demand_price_discount *= 3
                    light_load_charges = info.simulation.total_charges
                    energy_price_discount = light_load_charges * \
                        seasonal_charge[UsageLoad.LIGHT] * 0.5

                # 배터리 용량에 따른 할인 차등 적용
                battery_ratio = battery / self._cfg['contract_demand']
                if battery_ratio >= 0.1:
                    demand_price_discount *= 1.2
                    energy_price_discount * 1.2
                elif battery_ratio < 0.05:
                    demand_price_discount *= 0.8
                    energy_price_discount * 0.8

            # 최종 납부 전기요금 계산
            total_price = demand_price + energy_price - \
                demand_price_discount - energy_price_discount
            VAT = total_price * 0.1
            power_industry_fund = total_price * 0.037
            sim_payment = total_price + VAT + power_industry_fund

            # ESS 운용에 따른 수익 계산
            ess_profit = info.bill.payment - sim_payment

            # 전체 수익. 현재는 ESS 수익만 고려하지만 향후 PV, DR 수익도 고려
            cash_in = ess_profit

            # 투자금 집중회수 기간 적용해서 수용가 수익 분배 계산
            if sim_month <= intense_period:
                ess_share = ess_profit * intense_share_rate
            else:
                ess_share = ess_profit * normal_share_rate

            # 매출원가 계산. 현재는 ess_share만 고려되어 있는데 향후 다른 부분 추가
            cost_of_sales = ess_share

            # 금융 비용 계산
            interest = 0
            principal_payment = 0
            if sim_month <= payment_period:
                # 이자 계산
                interest = numpy.ipmt(interest_rate,
                                      sim_month + 1,
                                      payment_period,
                                      remain_principal)
                if sim_month >= grace_period:
                    # 거치 기간이 지나면 상환 원금 계산
                    principal_payment = numpy.ppmt(interest_rate,
                                                   sim_month - grace_period,
                                                   principal_payment_period,
                                                   principal)
                # 남은 원금 계산
                remain_principal += principal_payment
            finance_payment = interest + principal_payment

            # 판관비
            sga_expense = sga_rate * cash_in

            # 감가상각 계산
            if sim_month < depreciation_period:
                depreciation = construction_cost / depreciation_period
            else:
                depreciation = 0.0

            # 법인세 계산
            corp_tex_std = cash_in - cost_of_sales - sga_expense - interest - depreciation
            corp_tex = corp_tex_std * corp_tex_rate if corp_tex_std > 0.0 else 0.0

            # 비용 계산. 이자와 원금상환은 ipmt, ppmt 함수에서 음수로 나오기 때문에 빼줌
            cash_out = cost_of_sales - finance_payment + sga_expense + corp_tex

            # 현금 흐름 계산
            net_equity_cash = cash_in - cash_out
            yearly_net_equity_cash += net_equity_cash
            yearly_cumul_equity_cash += net_equity_cash
            net_project_cash = net_equity_cash - finance_payment
            yearly_net_projct_cash += net_project_cash
            yearly_cumul_project_cash += net_project_cash

            if info.month == 12:
                net_equity_cashes.append(yearly_net_equity_cash)
                net_project_cashes.append(yearly_net_projct_cash)
                cumul_equity_cashes.append(yearly_cumul_equity_cash)
                cumul_project_cashes.append(yearly_cumul_project_cash)
                yearly_net_equity_cash = 0.0
                yearly_net_projct_cash = 0.0
                year += 1

        net_equity_cashes.append(yearly_net_equity_cash)
        net_project_cashes.append(yearly_net_projct_cash)
        cumul_equity_cashes.append(yearly_cumul_equity_cash)
        cumul_project_cashes.append(yearly_cumul_project_cash)

        result["construction_cost"] = construction_cost
        result["equity"] = equity
        result["peak_cut"] = (self._annual_peak_usage -
                              simulated_annual_peak_usage) * 4
        result["equity_irr"] = numpy.irr(net_equity_cashes) * 100.0
        result["project_irr"] = numpy.irr(net_project_cashes) * 100.0

        net_equity_cashes.pop(0)
        net_project_cashes.pop(0)
        net_cash_flow = []
        cumul_cash_flow = []

        year = self._start_month.year
        for net_ecash, net_pcash, cumul_ecash, cumul_pcash in zip(net_equity_cashes, net_project_cashes, cumul_equity_cashes, cumul_project_cashes):
            net_cash_flow.append({
                "year": year,
                "equity": net_ecash,
                "project": net_pcash
            })
            cumul_cash_flow.append({
                "year": year,
                "equity": cumul_ecash,
                "project": cumul_pcash
            })
            year += 1
        result["net_cash_flow"] = net_cash_flow
        result["cumul_cash_flow"] = cumul_cash_flow
        result["summer_peak"] = self._compare_seasonal_peak(Season.SUMMER)
        result["winter_peak"] = self._compare_seasonal_peak(Season.WINTER)
        result["spring_fall_peak"] = self._compare_seasonal_peak(Season.SPRING_FALL)

    def is_valid(self):
        return self._measures and self._cfg

    def prepare(self):
        start_time = Utils.day_start_time(self._measure_start_date)
        end_time = Utils.day_start_time(Utils.next_month(start_time.date()))
        monthly_info = MonthlyInfo()
        months = 0
        for measure in self._measures:
            if measure.time < start_time:
                continue
            if measure.time >= end_time:
                if months < 11:
                    self._addMonthlyInfo(
                        monthly_info, start_time.date(), end_time.date())
                    start_time = end_time
                    end_time = Utils.day_start_time(
                        Utils.next_month(start_time.date()))
                    monthly_info = MonthlyInfo()
                    months += 1
                else:
                    break
            monthly_info.add(measure)

        self._addMonthlyInfo(monthly_info, start_time.date(), end_time.date())

        self._annual_peak_usage = 0.0
        for info in self._monthly_infos:
            if (info.month in (1, 2, 7, 8, 9, 12)
                    and self._annual_peak_usage < info.measure.peak_usage):
                self._annual_peak_usage = info.measure.peak_usage
            seasonal_peak = self._seasonal_peaks[Utils.season(info.month)]
            if seasonal_peak.usage < info.measure.peak_usage:
                seasonal_peak.usage = info.measure.peak_usage
                seasonal_peak.month = info.month
                seasonal_peak.day = info.peak_day

        for info in self._monthly_infos:
            info.update_bill(self._annual_peak_usage, self._charge)

    def simulate(self):
        results = []
        sim_cfg = self._cfg['simulation']
        battery = round(sim_cfg['battery']['min'] * self._cfg['contract_demand'] / 100) * 100
        max_battery = round(sim_cfg['battery']['max'] * self._cfg['contract_demand'] / 100) * 100
        id = 0
        while battery <= max_battery:
            for pcs in sim_cfg['pcs']:
                if pcs <= battery:
                    result = {
                        "id": id,
                        "battery": battery,
                        "pcs": pcs
                    }
                    self._simulate(result)
                    results.append(result)
                    id = id + 1
            battery += sim_cfg['battery']['inc']
            print('Battery', battery)

        with open('FeasibilityStudyResult.json', 'w') as results_file:
            json.dump(results, results_file, indent=2)

        # TODO
        if (False if self._cfg.get('debug') is None else self._cfg['debug']):
            with open('FeasibilityStudyResult.csv', 'w') as result_csv_file:
                result_csv = csv.writer(result_csv_file)
                result_csv.writerow([
                    'Battery(kWh)',
                    'PCS(kW)',
                    'Peak Cut(kW)',
                    'Equity IRR(%)'
                ])
                for result in results:
                    result_csv.writerow([
                        result['battery'],
                        result['pcs'],
                        result['peak_cut'],
                        result['equity_irr']
                    ])

            with open('FeasibilityStudyResult2.json', 'w') as debug_results_file:
                debug_results = []
                for result in results:
                    debug_result = {
                        'id': result['id'],
                        'battery': result['battery'],
                        'pcs': result['pcs'],
                        'construction_cost': result['construction_cost'],
                        'peak_cut': result['peak_cut'],
                        'equity_irr': result['equity_irr'],
                        'project_irr': result['project_irr']
                    }
                    def xform_cash_flow(result, name):
                        years = []
                        equit_cash_flow = []
                        project_cash_flow = []
                        for net_cash in result[name]:
                            years.append(net_cash['year'])
                            equit_cash_flow.append(net_cash['equity'])
                            project_cash_flow.append(net_cash['project'])
                        return {
                            'years': years,
                            'equity_cash_flow': equit_cash_flow,
                            'project_cash_flow': project_cash_flow
                        }
                    debug_result['net_cash_flow'] = xform_cash_flow(result, 'net_cash_flow')
                    debug_result['cumul_cash_flow'] = xform_cash_flow(result, 'cumul_cash_flow')
                    debug_results.append(debug_result)
                json.dump(debug_results, debug_results_file, indent=2)

print(" == Start ==")
simulator = Simulator()
if simulator.is_valid():
    simulator.prepare()
    simulator.simulate()
print(" == End ==")